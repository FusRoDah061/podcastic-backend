import ICreatePodcastDTO from '../dtos/ICreatePodcastDTO';
import IFromLastDaysPodcastDTO from '../dtos/IFromLastDaysPodcastDTO';
import ISearchPodcastDTO from '../dtos/ISearchPodcastDTO';
import { IPodcastDocument } from '../schemas/Podcast';

export default interface IPodcastRepository {
  create(data: ICreatePodcastDTO): Promise<IPodcastDocument>;
  findByFeedUrl(feedUrl: string): Promise<IPodcastDocument | null>;
  findAllWithoutEpisodes(): Promise<Array<IPodcastDocument>>;
  searchAllByName(data: ISearchPodcastDTO): Promise<Array<IPodcastDocument>>;
  findFromLastXDays(
    data: IFromLastDaysPodcastDTO,
  ): Promise<Array<IPodcastDocument>>;
}
