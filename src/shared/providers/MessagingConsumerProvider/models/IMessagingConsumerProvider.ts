import IMessagingConsumeDTO from '../dtos/IMessagingConsumeDTO';

export default interface IMessagingConsumerProvider {
  setRequeueAfter(timeMs: number): void;
  setMaxConcurrent(maxConcurrent: number): void;
  setMaxRetryCount(maxRetry: number): void;
  consume(data: IMessagingConsumeDTO): Promise<void>;
}
