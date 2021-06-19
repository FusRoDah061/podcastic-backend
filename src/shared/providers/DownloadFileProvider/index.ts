import { container } from 'tsyringe';
import AxiosDownloadFileProvider from './implementations/AxiosDownloadFileProvider';
import IDownloadFileProvider from './models/IDownloadFileProvider';

export default function setupDownloadFileProviderInjection(): void {
  container.registerSingleton<IDownloadFileProvider>(
    'DownloadFileProvider',
    AxiosDownloadFileProvider,
  );
}
