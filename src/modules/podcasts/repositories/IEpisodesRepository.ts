import ICreateEpisodeDTO from '../dtos/ICreateEpisodeDTO';
import IFindWithEspisodesDTO from '../dtos/IFindAllByPodcastDTO';
import Episode from '../schemas/Episode';

export default interface IEpisodesRepository {
  create(data: ICreateEpisodeDTO): Promise<Episode>;
  save(...episodes: Episode[]): Promise<void>;
  findAllByPodcast(data: IFindWithEspisodesDTO): Promise<Episode[]>;
}
