import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import translate from '../../../shared/utils/translate';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import { IPodcast } from '../schemas/Podcast';

interface IRequestDTO {
  podcastId: string;
  sort?: string | 'newest' | 'oldest' | 'longest' | 'shortest';
  episodeNameToSearch?: string;
}

@injectable()
export default class ListEpisodesService {
  constructor(
    @inject('PodcastRepository')
    private podcastRepository: IPodcastRepository,
  ) {}

  public async execute(
    { podcastId, sort, episodeNameToSearch }: IRequestDTO,
    locale: string,
  ): Promise<IPodcast> {
    const podcast = await this.podcastRepository.findWithEpisodes({
      podcastId,
      sort,
      episodeNameToSearch,
    });

    if (!podcast) {
      throw new AppError(translate('Podcast does not exist.', locale));
    }

    return podcast;
  }
}
