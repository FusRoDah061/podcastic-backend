import { connect } from 'amqplib';
import messagingConfig from '../../../../config/messagingConfig';
import IMessagingHealthcheckProvider from '../models/IMessagingHealthcheckProvider';

export default class RabbitmqHealthcheckProvider
  implements IMessagingHealthcheckProvider {
  public async ping(): Promise<void> {
    try {
      const conn = await connect(messagingConfig.config.rabbit.url);
      await conn.close();
    } catch (err) {
      throw new Error(`Could not reach rabbitmq database: ${err.message}`);
    }
  }
}
