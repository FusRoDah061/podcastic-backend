export default interface IFeedHealthcheckProvider {
  ping(feedUrl: string): Promise<void>;
}
