import { connect } from 'amqplib';
import messagingConfig from '../../../../config/messagingConfig';
import IMessagingConsumeDTO from '../dtos/IMessagingConsumeDTO';
import IMessagingConsumerProvider from '../models/IMessagingConsumerProvider';

export default class RabbitMqMessagingConsumerProvider
  implements IMessagingConsumerProvider {
  public async consume({
    queueName,
    callback,
  }: IMessagingConsumeDTO): Promise<void> {
    const channel = await connect(
      messagingConfig.config.rabbit.url,
    ).then(conn => conn.createChannel());

    await channel.assertQueue(queueName, { durable: true });

    await channel.consume(queueName, message => {
      try {
        callback(message);

        if (message) {
          channel.ack(message);
        }
      } catch (err) {
        console.error('Error consuming message: ', err);
      }
    });
  }
}
