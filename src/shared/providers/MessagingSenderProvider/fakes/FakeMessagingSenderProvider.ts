import IMessagingPostDTO from '../dtos/IMessagingPostDTO';
import IMessagingSenderProvider from '../models/IMessagingSenderProvider';

export default class FakeMessagingSenderProvider
  implements IMessagingSenderProvider {
  async post({
    queueName,
    message,
    allowRetry,
  }: IMessagingPostDTO): Promise<void> {
    // Do nothing
    console.log('Sent message to imaginary queue: ', {
      queueName,
      message,
      allowRetry,
    });
  }
}
