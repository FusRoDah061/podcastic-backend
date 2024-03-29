import { container } from 'tsyringe';
import BCryptHashProvider from './implementations/BCryptHashProvider';
import IHashProvider from './models/IHashProvider';

export default function setupHashProviderInjection(): void {
  container.registerSingleton<IHashProvider>(
    'HashProvider',
    BCryptHashProvider,
  );
}
