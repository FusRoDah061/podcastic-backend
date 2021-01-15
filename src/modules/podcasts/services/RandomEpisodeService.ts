import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import translate from '../../../shared/utils/translate';
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

  public async execute(
    { podcastId }: IRequestDTO,
    locale: string,
  ): Promise<IEpisode> {
    const podcast = await this.podcastRepository.findById({
      podcastId,
    });

    if (!podcast) {
      throw new AppError(translate('Podcast does not exist.', locale));
    }

    const availableEpisodes = podcast.episodes.filter(
      episode => episode.existsOnFeed,
    );

    const randomIndex = Math.floor(Math.random() * availableEpisodes.length);

    const randomEpisode = availableEpisodes[randomIndex];

    return randomEpisode;
  }
}
