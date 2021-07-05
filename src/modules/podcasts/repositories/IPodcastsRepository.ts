import ICreatePodcastDTO from '../dtos/ICreatePodcastDTO';
import IFindPodcastByIdDTO from '../dtos/IFindPodcastByIdDTO';
import ISearchPodcastDTO from '../dtos/ISearchPodcastDTO';
import Podcast from '../schemas/Podcast';

export default interface IPodcastRepository {
  create(data: ICreatePodcastDTO): Promise<Podcast>;
  save(podcast: Podcast): Promise<void>;
  findAll(): Promise<Array<Podcast>>;
  findByFeedUrl(feedUrl: string): Promise<Podcast | undefined>;
  searchAllByName(data: ISearchPodcastDTO): Promise<Array<Podcast>>;
  findTopMostRecent(howMany: number): Promise<Array<Podcast>>;
  findById(data: IFindPodcastByIdDTO): Promise<Podcast | undefined>;
}
