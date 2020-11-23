import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import { IEpisode } from '../schemas/Podcast';

interface IRequestDTO {
  podcastId: string;
}

@injectable()
export default class RandomEpisodeService {
  constructor(
    @inject('PodcastRepository')
    private podcastRepository: IPodcastRepository,
  ) {}

  public async execute({ podcastId }: IRequestDTO): Promise<IEpisode> {
    const podcast = await this.podcastRepository.findById({
      podcastId,
    });

    if (!podcast) {
      throw new AppError('Podcast does not exist.');
    }

    const randomIndex = Math.floor(Math.random() * podcast.episodes.length);

    const randomEpisode = podcast.episodes[randomIndex];

    return randomEpisode;
  }
}
