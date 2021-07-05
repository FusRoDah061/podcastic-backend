import { getRepository, Repository } from 'typeorm';
import ICreatePodcastDTO from '../../dtos/ICreatePodcastDTO';
import IFindPodcastByIdDTO from '../../dtos/IFindPodcastByIdDTO';
import ISearchPodcastDTO from '../../dtos/ISearchPodcastDTO';
import Podcast from '../../schemas/Podcast';
import IPodcastRepository from '../IPodcastsRepository';

export default class PodcastRepository implements IPodcastRepository {
  private ormRepository: Repository<Podcast>;

  constructor() {
    this.ormRepository = getRepository(Podcast);
  }

  public async create({
    name,
    description,
    imageUrl,
    feedUrl,
    websiteUrl,
    themeColor,
    textColor,
  }: ICreatePodcastDTO): Promise<Podcast> {
    const podcast = this.ormRepository.create({
      name,
      description,
      imageUrl,
      feedUrl,
      websiteUrl,
      themeColor,
      textColor,
    });

    await this.ormRepository.save(podcast);

    return podcast;
  }

  public async save(podcast: Podcast): Promise<void> {
    await this.ormRepository.save(podcast);
  }

  public async findAll(): Promise<Array<Podcast>> {
    const podcasts = await this.ormRepository.find();
    return podcasts;
  }

  public async findByFeedUrl(feedUrl: string): Promise<Podcast | undefined> {
    const podcast = await this.ormRepository.findOne({
      feedUrl,
    });

    return podcast;
  }

  public async searchAllByName({
    nameToSearch,
  }: ISearchPodcastDTO): Promise<Podcast[]> {
    const podcasts = await this.ormRepository.find({
      where: { name: nameToSearch },
      order: { name: 'ASC' },
    });

    return podcasts;
  }

  public async findTopMostRecent(howMany: number): Promise<Podcast[]> {
    const podcasts = await this.ormRepository.find({
      take: howMany,
      order: { createdAt: 'DESC' },
    });

    return podcasts;
  }

  public async findById({
    podcastId,
  }: IFindPodcastByIdDTO): Promise<Podcast | undefined> {
    const podcast = await this.ormRepository.findOne(podcastId);
    return podcast;
  }
}
