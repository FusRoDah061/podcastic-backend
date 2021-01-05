import { connect } from 'amqplib';
import messagingConfig from '../../../../config/messagingConfig';
import sleep from '../../../utils/sleep';
import IMessagingConsumeDTO from '../dtos/IMessagingConsumeDTO';
import IMessagingConsumerProvider from '../models/IMessagingConsumerProvider';

export default class RabbitMqMessagingConsumerProvider
  implements IMessagingConsumerProvider {
  private maxConcurrent = 0;

  private currentConcurrent = 0;

  private requeueAfterTime = 0;

  public setRequeueAfter(timeMs: number): void {
    console.log(`Requeue wait time: ${timeMs}`);

    this.requeueAfterTime = timeMs;
  }

  public setMaxConcurrent(maxConcurrent: number): void {
    console.log(`Maximum concurrent queue messages: ${maxConcurrent}`);

    this.maxConcurrent = maxConcurrent;
  }

  public async consume({
    queueName,
    callback,
  }: IMessagingConsumeDTO): Promise<void> {
    const channel = await connect(
      messagingConfig.config.rabbit.url,
    ).then(conn => conn.createChannel());

    await channel.assertQueue(queueName, { durable: true });

    await channel.consume(queueName, async message => {
      if (
        this.currentConcurrent >= this.maxConcurrent &&
        this.maxConcurrent !== 0 /* 0 = unlimited concurent messages */
      ) {
        await sleep(this.requeueAfterTime);

        if (message) {
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
          channel.nack(message);
        }
      }

      this.currentConcurrent -= 1;
    });
  }
}
