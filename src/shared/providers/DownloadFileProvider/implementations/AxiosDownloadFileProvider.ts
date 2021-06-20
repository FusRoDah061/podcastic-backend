import fs from 'fs';
import Axios from 'axios';
import path from 'path';
import IDownloadFileProvider, {
  IDownloadedFile,
} from '../models/IDownloadFileProvider';

export default class AxiosDownloadFileProvider
  implements IDownloadFileProvider {
  public async download(fileUrl: string): Promise<IDownloadedFile | null> {
    const response = await Axios.get(fileUrl, {
      responseType: 'stream',
    });

    if (response.status === 200) {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'tmp',
        Date.now().toFixed(),
      );

      const saveFile = new Promise<IDownloadedFile>((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(filePath))
          .on('finish', () =>
            resolve({
              path: filePath,
              type: response.headers['content-type'],
            }),
          )
          .on('error', (e: any) => reject(e));
      });

      return saveFile;
    }

    return null;
  }
}
