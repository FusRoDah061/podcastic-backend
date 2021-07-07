import { ConnectionOptions, createConnection, Connection } from 'typeorm';

export default function setupDatabase(): Promise<Connection> {
  const rootDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';

  console.log('Setting up database connection...');

  let postgresConnection: ConnectionOptions = {
    name: 'default',
    type: 'postgres',
    entities: [`./${rootDir}/modules/**/schemas/*.${fileExtension}`],
    migrations: [
      `./${rootDir}/shared/infra/typeorm/migrations/*.${fileExtension}`,
    ],
    cli: {
      migrationsDir: `./${rootDir}/shared/infra/typeorm/migrations`,
    },
  };

  if (process.env.DATABASE_URL) {
    postgresConnection = {
      ...postgresConnection,
      url: process.env.DATABASE_URL,
    };
  } else {
    postgresConnection = {
      ...postgresConnection,
      host: process.env.DEFAULT_DATABASE_HOST,
      port: Number(process.env.DEFAULT_DATABASE_PORT || 5432),
      username: process.env.DEFAULT_DATABASE_USER,
      password: process.env.DEFAULT_DATABASE_PASSWORD,
      database: process.env.DEFAULT_DATABASE_NAME,
    };
  }

  if (process.env.NODE_ENV === 'production') {
    postgresConnection = {
      ...postgresConnection,
      extra: {
        ssl: { rejectUnauthorized: false },
      },
    };
  }

  return createConnection(postgresConnection);
}
