import Axios from 'axios';
import AppError from '../../../errors/AppError';
import IFeedHealthcheckProvider from '../models/IFeedHealthcheckProvider';

export default class AxiosFeedHealthcheckProvider
  implements IFeedHealthcheckProvider {
  public async ping(feedUrl: string): Promise<void> {
    try {
      const response = await Axios.get(feedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
        },
      });

      if (response.status !== 200) {
        throw new AppError('Bad status code');
      }
    } catch (err) {
      throw new AppError("Couldn't reach feed");
    }
  }
}
