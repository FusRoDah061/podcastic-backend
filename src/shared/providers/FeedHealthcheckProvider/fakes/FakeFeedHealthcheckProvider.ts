import IFeedHealthcheckProvider from '../models/IFeedHealthcheckProvider';

export default class FakeFeedHealthcheckProvider
  implements IFeedHealthcheckProvider {
  public VALID_URL = 'www.some-valid-address.com';

  public INVALID_URL = 'www.some-invalid-address.com';

  public async ping(feedUrl: string): Promise<void> {
    console.log('Sent request to ', feedUrl);

    if (this.INVALID_URL === feedUrl) {
      throw new Error(`Couldn't reach feed ${feedUrl}.`);
    }
  }
}
