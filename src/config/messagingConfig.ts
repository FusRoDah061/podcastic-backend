interface IMessagingConfig {
  driver: 'rabbit';
  queueNames: Record<string, string>;
  config: {
    rabbit: {
      url: string;
    };
  };
}

const config = {
  driver: process.env.MESSAGING_DRIVER,

  queueNames: {
    podcasts: process.env.QUEUE_PODCASTS || 'podcasts',
  },

  config: {
    rabbit: {
      url: process.env.MQ_URL || process.env.CLOUDAMQP_URL,
    },
  },
} as IMessagingConfig;

export default config;
