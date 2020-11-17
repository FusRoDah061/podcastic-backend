import { inject, injectable } from 'tsyringe';
import IPodcastQueueMessage from '../dtos/IPodcastQueueMessage';
import IPodcastRepository from '../repositories/IPodcastsRepository';

@injectable()
export default class RefreshPodcastFeedService {
  constructor(
    @inject('PodcastRepository')
    private podcastsRepository: IPodcastRepository,
  ) {}

  public async execute({ rss_url }: IPodcastQueueMessage): Promise<void> {
    console.log('Refresh feed ', rss_url);
    const podcast = await this.podcastsRepository.findByRssUrl(rss_url);

    if (!podcast) {
      console.log('Adding a new feed: ', rss_url);

      // TODO: Buscar xml do feed para pegar as informações e verificar se existe (é válido)

      await this.podcastsRepository.create({
        name: 'Teste',
        description: 'Teste',
        image_url: 'https://via.placeholder.com/150',
        rss_url,
      });
    }
  }
}
