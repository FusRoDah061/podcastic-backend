type ServiceStatus = 'up' | 'down';

export default interface IHealth {
  status: 'ok' | 'nok';
  uptime: number;
  timestamp: number;
  services: {
    database: ServiceStatus;
    messaging: ServiceStatus;
    jobs: ServiceStatus;
  };
}
