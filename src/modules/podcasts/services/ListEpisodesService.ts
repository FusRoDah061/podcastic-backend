import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import translate from '../../../shared/utils/translate';
import IEpisodesRepository from '../repositories/IEpisodesRepository';
import IPodcastsRepository from '../repositories/IPodcastsRepository';
import Episode from '../schemas/Episode';
import Podcast from '../schemas/Podcast';

interface IRequestDTO {
  podcastId: string;
  sort?: string | 'newest' | 'oldest' | 'longest' | 'shortest';
  episodeNameToSearch?: string;
}

interface IPodcastResponse extends Podcast {
  episodes: Episode[];
}

@injectable()
export default class ListEpisodesService {
  constructor(
    @inject('PodcastRepository')
    private podcastsRepository: IPodcastsRepository,

    @inject('EpisodeRepository')
    private episodesRepository: IEpisodesRepository,
  ) {}

  public async execute(
    { podcastId, sort, episodeNameToSearch }: IRequestDTO,
    locale: string,
  ): Promise<IPodcastResponse> {
    const podcast = await this.podcastsRepository.findById({ podcastId });

    if (!podcast) {
      throw new AppError(translate('Podcast does not exist.', locale));
    }

    const episodes = await this.episodesRepository.findAllByPodcast({
      podcastId,
      sort,
      episodeNameToSearch,
    });

    return {
      ...podcast,
      episodes,
    };
  }
}
