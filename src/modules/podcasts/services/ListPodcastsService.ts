import { inject, injectable } from 'tsyringe';
import { IPaginatedResponse } from '../../../shared/routes';
import IPodcastRepository, {
  IPagination,
} from '../repositories/IPodcastsRepository';
import { IPodcast } from '../schemas/Podcast';

@injectable()
export default class ListPodcastsService {
  constructor(
    @inject('PodcastRepository')
    private podcastRepository: IPodcastRepository,
  ) {}

  public async execute(
    pagination: IPagination,
  ): Promise<IPaginatedResponse<IPodcast>> {
    const podcasts = await this.podcastRepository.find(pagination);

    return podcasts;
  }
}
