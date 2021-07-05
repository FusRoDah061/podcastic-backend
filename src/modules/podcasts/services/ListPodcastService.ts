import { inject, injectable } from 'tsyringe';
import IPodcastRepository from '../repositories/IPodcastsRepository';
import Podcast from '../schemas/Podcast';

@injectable()
export default class ListPodcastService {
  constructor(
    @inject('PodcastRepository')
    private podcastRepository: IPodcastRepository,
  ) {}

  public async execute(): Promise<Array<Podcast>> {
    const podcasts = await this.podcastRepository.findAll();

    return podcasts;
  }
}
