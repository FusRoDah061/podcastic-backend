import { inject, injectable } from 'tsyringe';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import Podcast from '../schemas/Podcast';

interface IRequestDTO {
  howMany: number;
}

@injectable()
export default class RecentPodcastsService {
  constructor(
    @inject('PodcastRepository')
    private podcastRepository: IPodcastRepository,
  ) {}

  public async execute({ howMany }: IRequestDTO): Promise<Array<Podcast>> {
    const podcasts = await this.podcastRepository.findTopMostRecent(howMany);

    return podcasts;
  }
}
