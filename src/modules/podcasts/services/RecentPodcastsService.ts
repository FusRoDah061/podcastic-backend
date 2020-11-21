import { inject, injectable } from 'tsyringe';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import { IPodcast } from '../schemas/Podcast';

interface IRequestDTO {
  daysOld: number;
}

@injectable()
export default class RecentPodcastsService {
  constructor(
    @inject('PodcastRepository')
    private podcastRepository: IPodcastRepository,
  ) {}

  public async execute({ daysOld }: IRequestDTO): Promise<Array<IPodcast>> {
    const podcasts = await this.podcastRepository.findFromLastXDays({
      daysOld,
    });

    return podcasts;
  }
}
