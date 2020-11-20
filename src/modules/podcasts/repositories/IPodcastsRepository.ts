import ICreatePodcastDTO from '../dtos/ICreatePodcastDTO';
import { IPodcastDocument } from '../schemas/Podcast';

export default interface IPodcastRepository {
  create(data: ICreatePodcastDTO): Promise<IPodcastDocument>;
  findByFeedUrl(feedUrl: string): Promise<IPodcastDocument | null>;
}
