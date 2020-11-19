import { getMongoRepository, MongoRepository } from 'typeorm';
import ICreatePodcastDTO from '../../dtos/ICreatePodcastDTO';
import Podcast from '../../schemas/Podcast';
import IPodcastRepository from '../IPodcastsRepository';

export default class PodcastRepository implements IPodcastRepository {
  private ormRepository: MongoRepository<Podcast>;

  constructor() {
    this.ormRepository = getMongoRepository(Podcast);
  }

  public async create({
    name,
    description,
    image_url,
    rss_url,
    website_url,
  }: ICreatePodcastDTO): Promise<Podcast> {
    const podcast = this.ormRepository.create({
      name,
      description,
      image_url,
      rss_url,
      website_url,
    });

    await this.ormRepository.save(podcast);

    return podcast;
  }

  public async findById(id: string): Promise<Podcast | undefined> {
    const podcast = await this.ormRepository.findOne(id);

    return podcast;
  }

  public async findByRssUrl(rssUrl: string): Promise<Podcast | undefined> {
    const podcast = await this.ormRepository.findOne({
      rss_url: rssUrl,
    });

    return podcast;
  }
}
