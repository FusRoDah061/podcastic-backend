import { container } from 'tsyringe';
import IEpisodesRepository from './modules/podcasts/repositories/IEpisodesRepository';
import EpisodesRepository from './modules/podcasts/repositories/implementations/EpisodesRepository';
import PodcastsRepository from './modules/podcasts/repositories/implementations/PodcastsRepository';
import IPodcastsRepository from './modules/podcasts/repositories/IPodcastsRepository';
import PostgresUsersRepository from './modules/users/repositories/implementations/PostgresUsersRepository';
import IUsersRepository from './modules/users/repositories/IUsersRepository';
import setupProviderInjections from './shared/providers';

export default function setupInjections(): void {
  console.log('Setting up dependency injections...');

  container.registerSingleton<IPodcastsRepository>(
    'PodcastRepository',
    PodcastsRepository,
  );

  container.registerSingleton<IEpisodesRepository>(
    'EpisodeRepository',
    EpisodesRepository,
  );

  container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    PostgresUsersRepository,
  );

  setupProviderInjections();
}
