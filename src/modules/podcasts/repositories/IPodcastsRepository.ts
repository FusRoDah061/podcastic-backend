import ICreatePodcastDTO from '../dtos/ICreatePodcastDTO';
import { IPodcast } from '../schemas/Podcast';

export default interface IPodcastRepository {
  create(data: ICreatePodcastDTO): Promise<IPodcast>;
  findByFeedUrl(feedUrl: string): Promise<IPodcast | null>;
}
