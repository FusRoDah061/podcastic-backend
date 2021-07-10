import ICreateEpisodeDTO from '../dtos/ICreateEpisodeDTO';
import IFindWithEspisodesDTO from '../dtos/IFindAllByPodcastDTO';
import { IEpisode } from '../schemas/Episode';

export default interface IEpisodesRepository {
  create(data: ICreateEpisodeDTO): Promise<IEpisode>;
  save(...episodes: IEpisode[]): Promise<void>;
  findAllByPodcast(data: IFindWithEspisodesDTO): Promise<IEpisode[]>;
}
