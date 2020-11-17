import { ConsumeMessage } from 'amqplib';

type CallbackFunction = (msg: ConsumeMessage | null) => void;

export default interface IMessagingConsumeDTO {
  queueName: string;
  callback: CallbackFunction;
}
