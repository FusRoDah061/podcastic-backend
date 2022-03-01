import IDownloadFileProvider, {
  IDownloadedFile,
} from '../models/IDownloadFileProvider';

export default class FakeDownloadFileProvider implements IDownloadFileProvider {
  public async download(fileUrl: string): Promise<IDownloadedFile | null> {
    return {
      path: fileUrl,
      type: '',
    };
  }
}
