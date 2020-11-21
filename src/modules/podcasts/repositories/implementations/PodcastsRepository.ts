import { addDays, compareDesc, compareAsc } from 'date-fns';
import ICreatePodcastDTO from '../../dtos/ICreatePodcastDTO';
import IFindWithEspisodesDTO from '../../dtos/IFindWithEspisodesDTO';
import IFromLastDaysPodcastDTO from '../../dtos/IFromLastDaysPodcastDTO';
import ISearchPodcastDTO from '../../dtos/ISearchPodcastDTO';
import PodcastModel, {
  IEpisode,
  IPodcast,
  IPodcastDocument,
} from '../../schemas/Podcast';
import IPodcastRepository from '../IPodcastsRepository';

export default class PodcastRepository implements IPodcastRepository {
  public async create({
    name,
    description,
    imageUrl,
    feedUrl,
    websiteUrl,
  }: ICreatePodcastDTO): Promise<IPodcastDocument> {
    const podcastDefinition: IPodcast = {
      name,
      description,
      imageUrl,
      feedUrl,
      websiteUrl,
      episodes: [],
    };

    const podcast = await PodcastModel.create(podcastDefinition);

    return podcast;
  }

  public async findAll(): Promise<Array<IPodcastDocument>> {
    const podcasts = await PodcastModel.find();
    return podcasts;
  }

  public async findByFeedUrl(
    feedUrl: string,
  ): Promise<IPodcastDocument | null> {
    const podcast = await PodcastModel.findOne({
      feedUrl,
    });

    return podcast;
  }

  public async findAllWithoutEpisodes(): Promise<IPodcastDocument[]> {
    const podcasts = await PodcastModel.find({}, [
      '_id',
      'name',
      'description',
      'imageUrl',
      'feedUrl',
      'websiteUrl',
      'createdAt',
      'updatedAt',
    ]).sort({
      name: 1,
    });

    return podcasts;
  }

  public async searchAllByName({
    nameToSearch,
  }: ISearchPodcastDTO): Promise<IPodcastDocument[]> {
    const podcasts = await PodcastModel.find(
      {
        name: new RegExp(`${nameToSearch}`, 'i'),
      },
      [
        '_id',
        'name',
        'description',
        'imageUrl',
        'feedUrl',
        'websiteUrl',
        'createdAt',
        'updatedAt',
      ],
    ).sort({
      name: 1,
    });

    return podcasts;
  }

  public async findFromLastXDays({
    daysOld,
  }: IFromLastDaysPodcastDTO): Promise<IPodcastDocument[]> {
    const now = new Date();
    const pastDate = addDays(now, daysOld * -1);

    const podcasts = await PodcastModel.find(
      {
        createdAt: { $gt: pastDate, $lt: now },
      },
      [
        '_id',
        'name',
        'description',
        'imageUrl',
        'feedUrl',
        'websiteUrl',
        'createdAt',
        'updatedAt',
      ],
    ).sort({
      createdAt: -1,
    });

    return podcasts;
  }

  public async findWithEpisodes({
    podcastId,
    sort,
    episodeNameToSearch,
  }: IFindWithEspisodesDTO): Promise<IPodcastDocument | null> {
    let sortFunction: (a: IEpisode, b: IEpisode) => number;

    switch (sort) {
      case 'oldest':
        sortFunction = (a: IEpisode, b: IEpisode) => {
          return compareAsc(a.date, b.date);
        };
        break;
      case 'longest':
        sortFunction = (a: IEpisode, b: IEpisode) => {
          return b.file.length - a.file.length;
        };
        break;
      case 'shortest':
        sortFunction = (a: IEpisode, b: IEpisode) => {
          return a.file.length - b.file.length;
        };
        break;
      default:
        sortFunction = (a: IEpisode, b: IEpisode) => {
          return compareDesc(a.date, b.date);
        };
    }

    const podcast = await PodcastModel.findById(podcastId);

    if (podcast) {
      const filteredEpisodes = !episodeNameToSearch
        ? podcast.episodes
        : podcast.episodes.filter(episode => {
            return episode.title
              .toLocaleLowerCase()
              .includes(episodeNameToSearch.toLocaleLowerCase());
          });

      filteredEpisodes.sort(sortFunction);

      podcast.episodes = filteredEpisodes;
    }

    return podcast;
  }
}
