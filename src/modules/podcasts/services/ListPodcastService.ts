import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import translate from '../../../shared/utils/translate';
import IPodcastsRepository from '../repositories/IPodcastsRepository';
import Podcast from '../schemas/Podcast';

@injectable()
export default class ListEpisodesService {
  constructor(
    @inject('PodcastRepository')
    private podcastsRepository: IPodcastsRepository,
  ) {}

  public async execute(podcastId: string, locale: string): Promise<Podcast> {
    const podcast = await this.podcastsRepository.findById({ podcastId });

    if (!podcast) {
      throw new AppError(translate('Podcast does not exist.', locale));
    }

    return podcast;
  }
}
