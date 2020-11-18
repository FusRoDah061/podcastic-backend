export default interface IFeedHealthcheckProvider {
  ping(url: string): Promise<void>;
}
