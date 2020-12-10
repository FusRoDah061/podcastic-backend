import { container } from 'tsyringe';
import MongodbHealthcheckProvider from './implementations/MongodbHealthcheckProvider';
import IDatabaseHealthcheckProvider from './models/IDatabaseHealthcheckProvider';

export default function setupDatabaseHealthcheckProviderInjection(): void {
  container.registerSingleton<IDatabaseHealthcheckProvider>(
    'DatabaseHealthcheckProvider',
    MongodbHealthcheckProvider,
  );
}
