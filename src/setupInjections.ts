import { container } from 'tsyringe';
import PodcastRepository from './modules/podcasts/repositories/implementations/PodcastsRepository';
import IPodcastRepository from './modules/podcasts/repositories/IPodcastsRepository';
import './shared/providers';

export default function setupInjections(): void {
  container.registerSingleton<IPodcastRepository>(
    'PodcastRepository',
    PodcastRepository,
  );
}
