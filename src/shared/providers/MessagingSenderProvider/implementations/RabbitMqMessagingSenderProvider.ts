import { connect } from 'amqplib';
import messagingConfig from '../../../../config/messagingConfig';
import IMessagingPostDTO from '../dtos/IMessagingPostDTO';
import IMessagingSenderProvider from '../models/IMessagingSenderProvider';

export default class RabbitMqMessagingSenderProvider
  implements IMessagingSenderProvider {
  async post({ queueName, message }: IMessagingPostDTO): Promise<void> {
    console.log(
      'Creating channel with RabbitMQ using url ',
      messagingConfig.config.rabbit.url,
    );

    if (!queueName) {
      throw new Error(`Invalid queue name ${queueName}`);
    }

    const channel = await connect(
      messagingConfig.config.rabbit.url,
    ).then(conn => conn.createChannel());

    console.log('Posting o queue ', queueName);

    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }
}
