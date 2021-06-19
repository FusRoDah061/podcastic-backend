import fs from 'fs';
import Axios from 'axios';
import path from 'path';
import IDownloadFileProvider from '../models/IDownloadFileProvider';

export default class AxiosDownloadFileProvider
  implements IDownloadFileProvider {
  public async download(fileUrl: string): Promise<string | null> {
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

      const saveFile = new Promise<string>((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(filePath))
          .on('finish', () => resolve(filePath))
          .on('error', (e: any) => reject(e));
      });

      return saveFile;
    }

    return null;
  }
}
