import { addDays } from 'date-fns';
import ICreatePodcastDTO from '../../dtos/ICreatePodcastDTO';
import IFromLastDaysPodcastDTO from '../../dtos/IFromLastDaysPodcastDTO';
import ISearchPodcastDTO from '../../dtos/ISearchPodcastDTO';
import PodcastModel, {
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
}
