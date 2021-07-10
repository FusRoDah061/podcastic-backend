import { inject, injectable } from 'tsyringe';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import { IPodcast } from '../schemas/Podcast';

interface IRequestDTO {
  howMany: number;
}

@injectable()
export default class RecentPodcastsService {
  constructor(
    @inject('PodcastRepository')
    private podcastRepository: IPodcastRepository,
  ) {}

  public async execute({ howMany }: IRequestDTO): Promise<Array<IPodcast>> {
    const podcasts = await this.podcastRepository.findTopMostRecent(howMany);

    return podcasts;
  }
}
