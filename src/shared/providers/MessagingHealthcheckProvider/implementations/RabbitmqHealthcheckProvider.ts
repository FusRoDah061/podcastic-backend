import { connect } from 'amqplib';
import messagingConfig from '../../../../config/messagingConfig';
import IMessagingHealthcheckProvider from '../models/IMessagingHealthcheckProvider';

export default class RabbitmqHealthcheckProvider
  implements IMessagingHealthcheckProvider {
  public async ping(): Promise<void> {
    try {
      const channel = await connect(
        messagingConfig.config.rabbit.url,
      ).then(conn => conn.createChannel());

      await channel.close();
    } catch (err) {
      throw new Error(`Could not reach rabbitmq database: ${err.message}`);
    }
  }
}
