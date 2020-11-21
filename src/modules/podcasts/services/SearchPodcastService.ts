import { inject, injectable } from 'tsyringe';
import IPodcastRepository from '../repositories/IPodcastsRepository';
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

  public async execute({
    nameToSearch,
  }: IRequestDTO): Promise<Array<IPodcast>> {
    const podcasts = await this.podcastRepository.searchAllByName({
      nameToSearch,
    });

    return podcasts;
  }
}
