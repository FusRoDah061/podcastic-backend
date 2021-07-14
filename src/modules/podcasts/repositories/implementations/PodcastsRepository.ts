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

export default class PodcastRepository implements IPodcastsRepository {
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

  public async find(
    pagination: IPagination,
  ): Promise<IPaginatedResponse<IPodcast>> {
    const { page, pageSize } = pagination;

    const podcastsPage = await PodcastModel.paginate(
      {},
      {
        limit: pageSize,
        page,
      },
    );

    return buildPaginatedResponse(podcastsPage);
  }

  public async findAll(): Promise<IPodcast[]> {
    const podcasts = await PodcastModel.find();

    return podcasts;
  }

  public async findByFeedUrl(feedUrl: string): Promise<IPodcast | null> {
    const podcast = await PodcastModel.findOne({
      feedUrl,
    });

    return podcast?.toObject();
  }

  public async searchAllByName(
    { nameToSearch }: ISearchPodcastDTO,
    pagination: IPagination,
  ): Promise<IPaginatedResponse<IPodcast>> {
    const { page, pageSize } = pagination;

    const podcastsPage = await PodcastModel.paginate(
      {
        name: new RegExp(`${nameToSearch}`, 'i'),
      },
      {
        limit: pageSize,
        page,
        sort: {
          name: 1,
        },
      },
    );

    return buildPaginatedResponse(podcastsPage);
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
