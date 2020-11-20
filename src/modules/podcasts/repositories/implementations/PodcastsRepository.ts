import ICreatePodcastDTO from '../../dtos/ICreatePodcastDTO';
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
}
