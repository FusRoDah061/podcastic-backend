import faker from 'faker';
import buildPaginatedResponse from '../../../../shared/infra/mongoose/helpers/buildPaginatedResponse';
import { IPaginatedResponse } from '../../../../shared/routes';
import ICreatePodcastDTO from '../../dtos/ICreatePodcastDTO';
import IFindPodcastByIdDTO from '../../dtos/IFindPodcastByIdDTO';
import ISearchPodcastDTO from '../../dtos/ISearchPodcastDTO';
import PodcastModel, { IPodcast } from '../../schemas/Podcast';
import IPodcastsRepository, { IPagination } from '../IPodcastsRepository';

const DEFAULT_FIELDS = [
  'name',
  'description',
  'imageUrl',
  'feedUrl',
  'websiteUrl',
  'themeColor',
  'textColor',
  'createdAt',
  'updatedAt',
  'isServiceAvailable',
  'lastSuccessfulHealthcheckAt',
];

const podcasts: IPodcast[] = [];

export default class FakePodcastRepository implements IPodcastsRepository {
  public async save(podcast: IPodcast): Promise<void> {
    const index = podcasts.findIndex(p => p.id === podcast.id);
    podcasts[index] = podcast;
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

    podcasts.push(podcast);

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
    return podcasts;
  }

  public async findByFeedUrl(feedUrl: string): Promise<IPodcast | null> {
    const podcast = podcasts.find(p => p.feedUrl === feedUrl);

    return podcast ?? null;
  }

  public async searchAllByName(
    { nameToSearch }: ISearchPodcastDTO,
    pagination: IPagination,
  ): Promise<IPaginatedResponse<IPodcast>> {
    return {
      data: [
        {
          id: faker.datatype.hexaDecimal(24),
          name: nameToSearch,
          description: '',
          imageUrl: '',
          feedUrl: '',
        },
      ],
      hasNextPage: false,
      hasPreviousPage: false,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: 0,
      totalResults: 0,
    };
  }

  public async findTopMostRecent(howMany: number): Promise<IPodcast[]> {
    return podcasts.splice(0, howMany);
  }

  public async findById({
    podcastId,
  }: IFindPodcastByIdDTO): Promise<IPodcast | null> {
    const podcast = podcasts.find(p => p.id === podcastId);

    return podcast ?? null;
  }
}
