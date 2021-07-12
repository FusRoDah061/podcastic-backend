import { IPaginatedResponse } from '../../../shared/routes';
import ICreateEpisodeDTO from '../dtos/ICreateEpisodeDTO';
import IFindAllByPodcastDTO from '../dtos/IFindAllByPodcastDTO';
import { IEpisode } from '../schemas/Episode';
import { IPagination } from './IPodcastsRepository';

export default interface IEpisodesRepository {
  create(data: ICreateEpisodeDTO): Promise<IEpisode>;
  save(...episodes: IEpisode[]): Promise<void>;
  findByPodcast(
    data: IFindAllByPodcastDTO,
    pagination: IPagination,
  ): Promise<IPaginatedResponse<IEpisode>>;
  findAllByPodcast(podcastId: string): Promise<IEpisode[]>;
}
