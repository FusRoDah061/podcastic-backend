import faker from 'faker';
import { IPaginatedResponse } from '../../../../shared/routes';
import ICreateEpisodeDTO from '../../dtos/ICreateEpisodeDTO';
import IFindAllByPodcastDTO from '../../dtos/IFindAllByPodcastDTO';
import { IEpisode } from '../../schemas/Episode';
import IEpisodesRepository from '../IEpisodesRepository';
import { IPagination } from '../IPodcastsRepository';

export default class FakeEpisodesRepository implements IEpisodesRepository {
  private fakeEpisodes: IEpisode[] = [];

  public async create({
    podcastId,
    title,
    description,
    date,
    image,
    duration,
    url,
    mediaType,
    sizeBytes,
  }: ICreateEpisodeDTO): Promise<IEpisode> {
    const episode: IEpisode = {
      id: faker.datatype.hexaDecimal(24),
      podcastId,
      title,
      description,
      date,
      image,
      duration,
      url,
      mediaType,
      sizeBytes,
      existsOnFeed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.fakeEpisodes.push(episode);

    return episode;
  }

  public async save(...episodes: IEpisode[]): Promise<void> {
    const newItems: IEpisode[] = [];

    episodes.forEach(episode => {
      const index = this.fakeEpisodes.findIndex(p => p.id === episode.id);

      if (index) {
        this.fakeEpisodes[index] = episode;
      } else {
        newItems.push(episode);
      }
    });

    this.fakeEpisodes.push(...newItems);
  }

  public async findByPodcast(
    { podcastId, episodeNameToSearch }: IFindAllByPodcastDTO,
    pagination: IPagination,
  ): Promise<IPaginatedResponse<IEpisode>> {
    return {
      data: this.fakeEpisodes.filter(e => {
        let shouldReturn = false;

        shouldReturn = e.podcastId === podcastId;

        if (episodeNameToSearch) {
          shouldReturn =
            shouldReturn &&
            e.title.toLowerCase().includes(episodeNameToSearch?.toLowerCase());
        }

        return shouldReturn;
      }),
      hasNextPage: false,
      hasPreviousPage: false,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: 0,
      totalResults: 0,
    };
  }

  public async findAllByPodcast(podcastId: string): Promise<IEpisode[]> {
    const episodes = this.fakeEpisodes.filter(e => e.podcastId === podcastId);

    return episodes ?? null;
  }
}
