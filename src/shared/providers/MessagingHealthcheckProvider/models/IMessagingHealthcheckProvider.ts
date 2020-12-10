export default interface IMessagingHealthcheckProvider {
  ping(): Promise<void>;
}
