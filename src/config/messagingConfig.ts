interface IMessagingConfig {
  driver: 'rabbit';
  queueNames: Record<string, string>;
  config: {
    rabbit: {
      url: string;
    };
    maxConcurrent: number;
    requeueAfterTime: number;
    maxRetries: number;
  };
}

const config = {
  driver: process.env.MESSAGING_DRIVER,

  queueNames: {
    podcasts: process.env.QUEUE_PODCASTS ?? 'podcasts',
  },

  config: {
    rabbit: {
      url: process.env.MQ_URL ?? process.env.CLOUDAMQP_URL,
    },
    maxConcurrent: Number(process.env.MESSAGING_MAX_CONCURRENT_MESSAGES ?? 5),
    requeueAfterTime: Number(process.env.MESSAGING_REQUEUE_AFTER),
    maxRetries: 10,
  },
} as IMessagingConfig;

export default config;
