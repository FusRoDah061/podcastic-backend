import { Repository, getRepository, ILike } from 'typeorm';
import ICreateEpisodeDTO from '../../dtos/ICreateEpisodeDTO';
import IFindAllByPodcastDTO from '../../dtos/IFindAllByPodcastDTO';
import Episode from '../../schemas/Episode';
import IEpisodesRepository from '../IEpisodesRepository';

export default class EpisodesRepository implements IEpisodesRepository {
  private ormRepository: Repository<Episode>;

  constructor() {
    this.ormRepository = getRepository(Episode);
  }

  public async create({
    podcastId,
    title,
    description,
    date,
    image,
    duration,
    url,
    mediaType,
    sizeBytes,
  }: ICreateEpisodeDTO): Promise<Episode> {
    const episode = this.ormRepository.create({
      podcastId,
      title,
      description,
      date,
      image,
      duration,
      url,
      mediaType,
      sizeBytes,
    });

    await this.ormRepository.save(episode);

    return episode;
  }

  public async save(...episodes: Episode[]): Promise<void> {
    await this.ormRepository.save(episodes);
  }

  public async findAllByPodcast({
    podcastId,
    episodeNameToSearch,
    sort,
  }: IFindAllByPodcastDTO): Promise<Episode[]> {
    let order: any;

    switch (sort) {
      case 'oldest':
        order = {
          date: 'ASC',
        };
        break;
      case 'longest':
        order = {
          duration: 'DESC',
        };
        break;
      case 'shortest':
        order = {
          duration: 'ASC',
        };
        break;
      default:
        order = {
          date: 'DESC',
        };
    }

    let episodes: Episode[];

    if (episodeNameToSearch) {
      episodes = await this.ormRepository.find({
        where: {
          podcastId,
          title: ILike(`%${episodeNameToSearch}%`),
        },
        order,
      });
    } else {
      episodes = await this.ormRepository.find({
        where: {
          podcastId,
        },
        order,
      });
    }

    return episodes;
  }
}
