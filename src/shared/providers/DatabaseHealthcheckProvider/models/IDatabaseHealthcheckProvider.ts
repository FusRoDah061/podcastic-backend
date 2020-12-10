export default interface IDatabaseHealthcheckProvider {
  ping(): Promise<void>;
}
