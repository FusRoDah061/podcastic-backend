import faker from 'faker';
import { IPaginatedResponse } from '../../../../shared/routes';
import ICreatePodcastDTO from '../../dtos/ICreatePodcastDTO';
import IFindPodcastByIdDTO from '../../dtos/IFindPodcastByIdDTO';
import ISearchPodcastDTO from '../../dtos/ISearchPodcastDTO';
import { IPodcast } from '../../schemas/Podcast';
import IPodcastsRepository, { IPagination } from '../IPodcastsRepository';

export default class FakePodcastRepository implements IPodcastsRepository {
  private fakePodcasts: IPodcast[] = [];

  public async save(podcast: IPodcast): Promise<void> {
    const index = this.fakePodcasts.findIndex(p => p.id === podcast.id);

    if (index) {
      this.fakePodcasts[index] = podcast;
    } else {
      this.fakePodcasts.push(podcast);
    }
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
    const podcast: IPodcast = {
      id: faker.datatype.hexaDecimal(24),
      name,
      description,
      imageUrl,
      feedUrl,
      websiteUrl,
      themeColor,
      textColor,
      isServiceAvailable: true,
      lastSuccessfulHealthcheckAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.fakePodcasts.push(podcast);

    return podcast;
  }

  public async find(
    pagination: IPagination,
  ): Promise<IPaginatedResponse<IPodcast>> {
    return {
      data: [],
      hasNextPage: false,
      hasPreviousPage: false,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: 0,
      totalResults: 0,
    };
  }

  public async findAll(): Promise<IPodcast[]> {
    return this.fakePodcasts;
  }

  public async findByFeedUrl(feedUrl: string): Promise<IPodcast | null> {
    const podcast = this.fakePodcasts.find(p => p.feedUrl === feedUrl);

    return podcast ?? null;
  }

  public async searchAllByName(
    { nameToSearch }: ISearchPodcastDTO,
    pagination: IPagination,
  ): Promise<IPaginatedResponse<IPodcast>> {
    return {
      data: this.fakePodcasts.filter(p =>
        p.name.toLowerCase().includes(nameToSearch.toLowerCase()),
      ),
      hasNextPage: false,
      hasPreviousPage: false,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: 0,
      totalResults: 0,
    };
  }

  public async findTopMostRecent(howMany: number): Promise<IPodcast[]> {
    return this.fakePodcasts.splice(0, howMany);
  }

  public async findById({
    podcastId,
  }: IFindPodcastByIdDTO): Promise<IPodcast | null> {
    const podcast = this.fakePodcasts.find(p => p.id === podcastId);

    return podcast ?? null;
  }
}
