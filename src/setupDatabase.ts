import { Connection, createConnections } from 'typeorm';

export default function setupDatabase(): Promise<Connection[]> {
  return createConnections();
}
