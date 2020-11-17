import IMessagingPostDTO from '../dtos/IMessagingPostDTO';

export default interface IMessagingSenderProvider {
  post(data: IMessagingPostDTO): Promise<void>;
}
