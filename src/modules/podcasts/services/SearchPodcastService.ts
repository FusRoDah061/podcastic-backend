import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import translate from '../../../shared/utils/translate';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import Podcast from '../schemas/Podcast';

interface IRequestDTO {
  nameToSearch: string;
}

@injectable()
export default class SearchPodcastService {
  constructor(
    @inject('PodcastRepository')
    private podcastRepository: IPodcastRepository,
  ) {}

  public async execute(
    { nameToSearch }: IRequestDTO,
    locale: string,
  ): Promise<Array<Podcast>> {
    if (!nameToSearch || !nameToSearch.trim()) {
      throw new AppError(translate('Search text must not be blank.', locale));
    }

    const podcasts = await this.podcastRepository.searchAllByName({
      nameToSearch,
    });

    return podcasts;
  }
}
