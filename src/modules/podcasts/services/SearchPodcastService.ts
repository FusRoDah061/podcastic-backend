import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import { IPaginatedResponse } from '../../../shared/routes';
import translate from '../../../shared/utils/translate';
import IPodcastRepository, {
  IPagination,
} from '../repositories/IPodcastsRepository';
import { IPodcast } from '../schemas/Podcast';

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
    pagination: IPagination,
    locale: string,
  ): Promise<IPaginatedResponse<IPodcast>> {
    if (!nameToSearch || !nameToSearch.trim()) {
      throw new AppError(translate('Search text must not be blank.', locale));
    }

    const podcasts = await this.podcastRepository.searchAllByName(
      {
        nameToSearch,
      },
      pagination,
    );

    return podcasts;
  }
}
