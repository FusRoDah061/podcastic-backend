export default interface IMessagingPostDTO {
  queueName: string;
  message: Record<string, unknown>;
}
