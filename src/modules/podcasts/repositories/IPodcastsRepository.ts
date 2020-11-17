import ICreatePodcastDTO from '../dtos/ICreatePodcastDTO';
import Podcast from '../schemas/Podcast';

export default interface IPodcastRepository {
  create(data: ICreatePodcastDTO): Promise<Podcast>;
  findById(id: string): Promise<Podcast | undefined>;
  findByRssUrl(rssUrl: string): Promise<Podcast | undefined>;
}
