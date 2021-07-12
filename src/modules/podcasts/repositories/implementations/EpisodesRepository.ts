import { compareAsc, compareDesc } from 'date-fns';
import { Query } from 'mongoose';
import buildPaginatedResponse from '../../../../shared/infra/mongoose/helpers/buildPaginatedResponse';
import { IPaginatedResponse } from '../../../../shared/routes';
import ICreateEpisodeDTO from '../../dtos/ICreateEpisodeDTO';
import IFindAllByPodcastDTO from '../../dtos/IFindAllByPodcastDTO';
import EpisodeModel, { IEpisode, IEpisodeModel } from '../../schemas/Episode';
import IEpisodesRepository from '../IEpisodesRepository';
import { IPagination } from '../IPodcastsRepository';

export default class EpisodesRepository implements IEpisodesRepository {
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
  }: ICreateEpisodeDTO): Promise<IEpisode> {
    const episode = await EpisodeModel.create({
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

    return episode.toObject();
  }

  public async save(...episodes: IEpisode[]): Promise<void> {
    const promises: Query<any>[] = [];

    episodes.forEach(episode => {
      promises.push(EpisodeModel.updateMany({ _id: episode.id }, episode));
    });

    await Promise.all(promises);
  }

  public async findByPodcast(
    { podcastId, episodeNameToSearch, sort }: IFindAllByPodcastDTO,
    pagination: IPagination,
  ): Promise<IPaginatedResponse<IEpisode>> {
    const { page, pageSize } = pagination;
    let querySort: Record<string, number>;

    switch (sort) {
      case 'oldest':
        querySort = { date: 1 };
        break;
      case 'longest':
        querySort = { duration: -1 };
        break;
      case 'shortest':
        querySort = { duration: 1 };

        break;
      default:
        // newest
        querySort = { date: -1 };
    }

    const episodesPage = await EpisodeModel.paginate(
      {
        title: new RegExp(`${episodeNameToSearch}`, 'i'),
        podcastId,
      },
      {
        limit: pageSize,
        page,
        sort: querySort,
      },
    );

    return buildPaginatedResponse(episodesPage);
  }

  public async findAllByPodcast(podcastId: string): Promise<IEpisode[]> {
    const episodes = await EpisodeModel.find({
      podcastId,
    });

    return episodes;
  }
}
