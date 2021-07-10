import { compareAsc, compareDesc } from 'date-fns';
import { Query } from 'mongoose';
import ICreateEpisodeDTO from '../../dtos/ICreateEpisodeDTO';
import IFindAllByPodcastDTO from '../../dtos/IFindAllByPodcastDTO';
import EpisodeModel, { IEpisode, IEpisodeModel } from '../../schemas/Episode';
import IEpisodesRepository from '../IEpisodesRepository';

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

  public async findAllByPodcast({
    podcastId,
    episodeNameToSearch,
    sort,
  }: IFindAllByPodcastDTO): Promise<IEpisode[]> {
    let sortFunction: (a: IEpisodeModel, b: IEpisodeModel) => number;

    switch (sort) {
      case 'oldest':
        sortFunction = (a: IEpisodeModel, b: IEpisodeModel) => {
          return compareAsc(a.date, b.date);
        };
        break;
      case 'longest':
        sortFunction = (a: IEpisodeModel, b: IEpisodeModel) => {
          if (b.duration === a.duration) return 0;

          if (a.duration > b.duration) {
            return -1;
          }

          return 1;
        };
        break;
      case 'shortest':
        sortFunction = (a: IEpisodeModel, b: IEpisodeModel) => {
          if (b.duration === a.duration) return 0;

          if (b.duration > a.duration) {
            return -1;
          }

          return 1;
        };
        break;
      default:
        sortFunction = (a: IEpisodeModel, b: IEpisodeModel) => {
          return compareDesc(a.date, b.date);
        };
    }

    const episodes = await EpisodeModel.find({ podcastId });

    if (episodes && episodes.length > 0) {
      const filteredEpisodes = !episodeNameToSearch
        ? episodes
        : episodes.filter(episode => {
            return episode.title
              .toLocaleLowerCase()
              .includes(episodeNameToSearch.toLocaleLowerCase());
          });

      filteredEpisodes.sort(sortFunction);

      return filteredEpisodes.map(o => o.toObject());
    }

    return episodes.map(o => o.toObject());
  }
}
