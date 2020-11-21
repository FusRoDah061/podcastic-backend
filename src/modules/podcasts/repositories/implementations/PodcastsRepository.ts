import ICreatePodcastDTO from '../../dtos/ICreatePodcastDTO';
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
    ]);

    return podcasts;
  }

  public async searchAllByName({
    nameToSearch,
  }: ISearchPodcastDTO): Promise<IPodcastDocument[]> {
    const podcasts = await PodcastModel.find(
      {
        name: new RegExp(`${nameToSearch}`, 'i'),
      },
      ['_id', 'name', 'description', 'imageUrl', 'feedUrl', 'websiteUrl'],
    );

    return podcasts;
  }
}
