import ICreatePodcastDTO from '../dtos/ICreatePodcastDTO';
import IFindPodcastByIdDTO from '../dtos/IFindPodcastByIdDTO';
import ISearchPodcastDTO from '../dtos/ISearchPodcastDTO';
import { IPodcast } from '../schemas/Podcast';

export default interface IPodcastRepository {
  create(data: ICreatePodcastDTO): Promise<IPodcast>;
  save(podcast: IPodcast): Promise<void>;
  findAll(): Promise<Array<IPodcast>>;
  findByFeedUrl(feedUrl: string): Promise<IPodcast | null>;
  searchAllByName(data: ISearchPodcastDTO): Promise<Array<IPodcast>>;
  findTopMostRecent(howMany: number): Promise<Array<IPodcast>>;
  findById(data: IFindPodcastByIdDTO): Promise<IPodcast | null>;
}
