import { ConsumeMessage } from 'amqplib';

export type CallbackFunction = (msg: ConsumeMessage | null) => void;

export default interface IMessagingConsumeDTO {
  queueName: string;
  callback: CallbackFunction;
}
