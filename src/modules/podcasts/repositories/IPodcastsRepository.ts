import { IPaginatedResponse } from '../../../shared/routes';
import ICreatePodcastDTO from '../dtos/ICreatePodcastDTO';
import IFindPodcastByIdDTO from '../dtos/IFindPodcastByIdDTO';
import ISearchPodcastDTO from '../dtos/ISearchPodcastDTO';
import { IPodcast } from '../schemas/Podcast';

export interface IPagination {
  pageSize: number;
  page: number;
}

export default interface IPodcastRepository {
  create(data: ICreatePodcastDTO): Promise<IPodcast>;
  save(podcast: IPodcast): Promise<void>;
  find(pagination: IPagination): Promise<IPaginatedResponse<IPodcast>>;
  findAll(): Promise<IPodcast[]>;
  findByFeedUrl(feedUrl: string): Promise<IPodcast | null>;
  searchAllByName(
    data: ISearchPodcastDTO,
    pagination: IPagination,
  ): Promise<IPaginatedResponse<IPodcast>>;
  findTopMostRecent(
    howMany: number,
    pagination?: IPagination,
  ): Promise<IPodcast[]>;
  findById(data: IFindPodcastByIdDTO): Promise<IPodcast | null>;
}
