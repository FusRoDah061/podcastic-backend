import { inject, injectable } from 'tsyringe';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import { IPodcast } from '../schemas/Podcast';

@injectable()
export default class ListPodcastService {
  constructor(
    @inject('PodcastRepository')
    private podcastRepository: IPodcastRepository,
  ) {}

  public async execute(): Promise<Array<IPodcast>> {
    const podcasts = await this.podcastRepository.findAll();

    return podcasts;
  }
}
