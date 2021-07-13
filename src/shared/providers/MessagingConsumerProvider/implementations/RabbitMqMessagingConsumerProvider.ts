import { Channel, connect } from 'amqplib';
import messagingConfig from '../../../../config/messagingConfig';
import sleep from '../../../utils/sleep';
import IMessagingConsumeDTO, {
  CallbackFunction,
} from '../dtos/IMessagingConsumeDTO';
import IMessagingConsumerProvider from '../models/IMessagingConsumerProvider';

export default class RabbitMqMessagingConsumerProvider
  implements IMessagingConsumerProvider {
  private maxConcurrent = 0;

  private currentConcurrent = 0;

  private requeueAfterTime = 0;

  private maxRetry = 0;

  private didSetupTopology: Map<string, boolean> = new Map();

  public setRequeueAfter(timeMs: number): void {
    console.log(`Requeue wait time: ${timeMs}`);

    this.requeueAfterTime = timeMs;
  }

  public setMaxConcurrent(maxConcurrent: number): void {
    console.log(`Maximum concurrent queue messages: ${maxConcurrent}`);

    this.maxConcurrent = maxConcurrent;
  }

  public setMaxRetryCount(maxRetry: number): void {
    this.maxRetry = maxRetry;
  }

  private async setupTopology(queueName: string, channel: Channel) {
    const mainExchange = `${queueName}Exchange`;
    const mainDlq = `${queueName}DLQ`;
    const mainDlx = `${queueName}DLX`;

    console.log(
      `Setting up queueing topology for queues: ${queueName}, ${mainExchange}, ${mainDlq}, ${mainDlx}`,
    );

    // Setup DLQ queues
    await channel.assertExchange(mainDlx, 'topic', {
      durable: true,
    });
    await channel.assertQueue(mainDlq, {
      durable: true,
      messageTtl: 180000, // 3 minutes
      deadLetterExchange: mainExchange,
    });
    await channel.bindQueue(mainDlq, mainDlx, '#');

    // Setup main queues
    await channel.assertExchange(mainExchange, 'fanout', {
      durable: true,
    });
    await channel.assertQueue(queueName, {
      durable: true,
      deadLetterExchange: mainDlx,
    });
    await channel.bindQueue(queueName, mainExchange, '#');
  }

  private async consumeMainQueue(
    queueName: string,
    callback: CallbackFunction,
    channel: Channel,
  ): Promise<void> {
    await channel.consume(queueName, async message => {
      if (
        this.currentConcurrent >= this.maxConcurrent &&
        this.maxConcurrent !== 0 /* 0 = unlimited concurent messages */
      ) {
        await sleep(this.requeueAfterTime);

        if (message) {
          // If the concurrent limit is reached, we reject the message so
          // it returns to the queue to be picked up again.
          channel.nack(message);
        }

        return;
      }

      this.currentConcurrent += 1;

      try {
        await callback(message);

        if (message) {
          channel.ack(message);
        }
      } catch (err) {
        console.error('Error consuming message: ', err);

        if (message) {
          if (message.properties.headers['x-allow-retry']) {
            // If the message can be retried later, we reject it to the DLQ.
            // This is not the same as the previou concurrency limit NACK, since
            // the DLQ retries will be limited to X retries before dropping the
            // message.
            const retryCount = message.properties.headers['x-death']
              ? message.properties.headers['x-death'][0].count
              : 1;

            if (retryCount <= this.maxRetry) {
              console.debug(
                'Rejecting message to retry. Current message retry count: ',
                retryCount,
              );
              channel.reject(message, false);
            } else {
              console.debug(
                'Accepting message to stop retrying. Current message retry count: ',
                retryCount,
              );
              channel.ack(message);
            }
          } else {
            // If the message cannot be retried later, we drop it completely
            channel.ack(message);
          }
        }
      }

      this.currentConcurrent -= 1;
    });
  }

  private async routeDlqQueue(
    queueName: string,
    channel: Channel,
  ): Promise<void> {
    const mainExchange = `${queueName}Exchange`;
    const mainDlq = `${queueName}DLQ`;

    await channel.consume(mainDlq, async message => {
      if (message) {
        const retryCount = message.properties.headers['x-retry-count']
          ? message.properties.headers['x-retry-count']
          : 1;

        console.log(
          'Got message from DLQ. Headers: ',
          message.properties.headers,
        );

        if (retryCount <= this.maxRetry) {
          // Publish message to the main queue again
          channel.publish(mainExchange, '', Buffer.from(message.content), {
            headers: {
              'x-allow-retry': message.properties.headers['x-allow-retry'],
              'x-retry-count': message.properties.headers['x-retry-count'],
            },
          });
        }

        channel.ack(message);
      }
    });
  }

  public async consume({
    queueName,
    callback,
  }: IMessagingConsumeDTO): Promise<void> {
    const channel = await connect(
      messagingConfig.config.rabbit.url,
    ).then(conn => conn.createChannel());

    if (!this.didSetupTopology.get(queueName)) {
      await this.setupTopology(queueName, channel);
      this.didSetupTopology.set(queueName, true);
    }

    await this.consumeMainQueue(queueName, callback, channel);
  }
}
