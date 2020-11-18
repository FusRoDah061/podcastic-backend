import { Message } from 'amqplib';
import IMessagingConsumeDTO from '../dtos/IMessagingConsumeDTO';

export default interface IMessagingConsumerProvider {
  consume(data: IMessagingConsumeDTO): Promise<void>;
}
