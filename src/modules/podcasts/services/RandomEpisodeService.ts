import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import translate from '../../../shared/utils/translate';
import IEpisodesRepository from '../repositories/IEpisodesRepository';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import { IEpisode } from '../schemas/Episode';

interface IRequestDTO {
  podcastId: string;
}

@injectable()
export default class RandomEpisodeService {
  constructor(
    @inject('PodcastRepository')
    private podcastRepository: IPodcastRepository,

    @inject('EpisodeRepository')
    private episodesRepository: IEpisodesRepository,
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

    const episodes = await this.episodesRepository.findAllByPodcast({
      podcastId,
    });

    const availableEpisodes = episodes.filter(episode => episode.existsOnFeed);

    const randomIndex = Math.floor(Math.random() * availableEpisodes.length);

    const randomEpisode = availableEpisodes[randomIndex];

    return randomEpisode;
  }
}
