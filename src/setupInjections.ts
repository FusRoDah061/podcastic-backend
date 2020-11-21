import { container } from 'tsyringe';
import PodcastRepository from './modules/podcasts/repositories/implementations/PodcastsRepository';
import IPodcastRepository from './modules/podcasts/repositories/IPodcastsRepository';
import setupProviderInjections from './shared/providers';

export default function setupInjections(): void {
  console.log('Setting up dependency injections...');

  container.registerSingleton<IPodcastRepository>(
    'PodcastRepository',
    PodcastRepository,
  );

  setupProviderInjections();
}
