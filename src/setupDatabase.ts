import mongoose, {
  ConnectionOptions as MongooseConnectionOptions,
} from 'mongoose';
import {
  ConnectionOptions as PostgresConnectionOptions,
  createConnection,
} from 'typeorm';

export const mongoConnectionOptions: MongooseConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

async function setupPostgresConnection(): Promise<void> {
  const rootDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
  const fileExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts';

  console.log('Setting up Postgres connection...');

  let postgresConnection: PostgresConnectionOptions = {
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

  await createConnection(postgresConnection);

  console.log('Got Postgres connection...');
}

async function setupMongodbConnection(): Promise<void> {
  console.log('Setting up MongoDB connection...');

  await mongoose.connect(process.env.MONGODB_URI ?? '', mongoConnectionOptions);

  console.log('Got MongoDB connection...');
}

export default async function setupDatabase(): Promise<void> {
  await Promise.all([setupPostgresConnection(), setupMongodbConnection()]);
}
