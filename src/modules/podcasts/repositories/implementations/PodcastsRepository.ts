import ICreatePodcastDTO from '../../dtos/ICreatePodcastDTO';
import IFindPodcastByIdDTO from '../../dtos/IFindPodcastByIdDTO';
import ISearchPodcastDTO from '../../dtos/ISearchPodcastDTO';
import PodcastModel, { IPodcast } from '../../schemas/Podcast';
import IPodcastRepository from '../IPodcastsRepository';

const DEFAULT_FIELDS = [
  '_id',
  'name',
  'description',
  'imageUrl',
  'feedUrl',
  'websiteUrl',
  'themeColor',
  'textColor',
  'createdAt',
  'updatedAt',
];

export default class PodcastRepository implements IPodcastRepository {
  public async save(podcast: IPodcast): Promise<void> {
    await PodcastModel.updateOne({ _id: podcast.id }, podcast);
  }

  public async create({
    name,
    description,
    imageUrl,
    feedUrl,
    websiteUrl,
    themeColor,
    textColor,
  }: ICreatePodcastDTO): Promise<IPodcast> {
    const podcast = await PodcastModel.create({
      name,
      description,
      imageUrl,
      feedUrl,
      websiteUrl,
      themeColor,
      textColor,
    });

    return podcast.toObject();
  }

  public async findAll(): Promise<Array<IPodcast>> {
    const podcasts = await PodcastModel.find();
    return podcasts.map(o => o.toObject());
  }

  public async findByFeedUrl(feedUrl: string): Promise<IPodcast | null> {
    const podcast = await PodcastModel.findOne({
      feedUrl,
    });

    return podcast?.toObject();
  }

  public async findAllWithoutEpisodes(): Promise<IPodcast[]> {
    const podcasts = await PodcastModel.find({}, DEFAULT_FIELDS).sort({
      name: 1,
    });

    return podcasts.map(o => o.toObject());
  }

  public async searchAllByName({
    nameToSearch,
  }: ISearchPodcastDTO): Promise<IPodcast[]> {
    const podcasts = await PodcastModel.find(
      {
        name: new RegExp(`${nameToSearch}`, 'i'),
      },
      DEFAULT_FIELDS,
    ).sort({
      name: 1,
    });

    return podcasts.map(o => o.toObject());
  }

  public async findTopMostRecent(howMany: number): Promise<IPodcast[]> {
    const podcasts = await PodcastModel.find({}, DEFAULT_FIELDS)
      .sort({
        createdAt: -1,
      })
      .limit(howMany);

    return podcasts.map(o => o.toObject());
  }

  public async findById({
    podcastId,
  }: IFindPodcastByIdDTO): Promise<IPodcast | null> {
    const podcast = await PodcastModel.findById(podcastId);
    return podcast?.toObject();
  }
}
