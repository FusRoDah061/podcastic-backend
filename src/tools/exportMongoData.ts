/* eslint-disable no-await-in-loop */
import 'reflect-metadata';
import 'dotenv/config';
import {
  ConnectionOptions as TypeormConnectionOptions,
  createConnection,
  getRepository,
} from 'typeorm';
import mongoose, {
  ConnectionOptions as MongoConnectionOptions,
  Document,
  Model,
  model,
  Schema,
} from 'mongoose';
import { exit } from 'process';
import Podcast from '../modules/podcasts/schemas/Podcast';
import Episode from '../modules/podcasts/schemas/Episode';

interface IEpisodeFile {
  url: string;
  mediaType: string;
  sizeBytes: number;
}

interface IEpisode {
  _id?: any;
  title: string;
  description: string;
  date: Date;
  image: string;
  duration: string;
  existsOnFeed?: boolean;
  file: IEpisodeFile;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IEpisodeBaseDocument extends IEpisode {
  _id: any;
}

interface IEpisodeDocument extends IEpisodeBaseDocument, Document {}

interface IPodcast {
  _id?: any;
  name: string;
  description: string;
  imageUrl: string;
  feedUrl: string;
  websiteUrl?: string;
  isServiceAvailable?: boolean;
  lastSuccessfulHealthcheckAt?: Date;
  episodes: Array<IEpisode>;
  themeColor?: string;
  textColor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IPodcastBaseDocument extends IPodcast {
  _id: any;
  episodesDocuments?: Array<IEpisodeDocument>;
}

interface IPodcastDocument extends IPodcastBaseDocument, Document {}

type IPodcastModel = Model<IPodcastDocument>;

async function setupTypeorm(): Promise<void> {
  const rootDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

  console.log('Setting up postgres connection...');

  let postgresConnection: TypeormConnectionOptions = {
    name: 'default',
    type: 'postgres',
    entities: [Podcast, Episode],
    migrations: [`./${rootDir}/shared/infra/typeorm/migrations/*{.ts,.js}`],
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

  console.log('Got postgres connection...');
}

async function setupMongoose(): Promise<void> {
  console.log('Setting up mongo connection...');

  const mongoConnectionOptions: MongoConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  };

  await mongoose.connect(process.env.MONGODB_URI ?? '', mongoConnectionOptions);

  console.log('Got mongo connection...');
}

Promise.all([setupTypeorm(), setupMongoose()]).then(async () => {
  const EpisodeFileSchema = new Schema(
    {
      url: {
        type: String,
        required: true,
      },
      mediaType: {
        type: String,
        required: true,
      },
      sizeBytes: {
        type: Number,
        required: true,
      },
    },
    {
      _id: false,
    },
  );

  const EpisodeSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      date: {
        type: Date,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
      existsOnFeed: {
        type: Boolean,
        required: false,
        default: true,
      },
      file: EpisodeFileSchema,
    },
    {
      timestamps: true,
    },
  );

  const PodcastSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
      feedUrl: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
      websiteUrl: {
        type: String,
        required: false,
      },
      isServiceAvailable: {
        type: Boolean,
        required: false,
        default: true,
      },
      lastSuccessfulHealthcheckAt: {
        type: Date,
        required: false,
        default: Date.now,
      },
      themeColor: {
        type: String,
        required: false,
      },
      textColor: {
        type: String,
        required: false,
      },
      episodes: [EpisodeSchema],
    },
    {
      timestamps: true,
    },
  );

  const PodcastModel = model<IPodcastDocument, IPodcastModel>(
    'PodcastModel',
    PodcastSchema,
    'podcasts',
  );

  const podcastRepository = getRepository(Podcast);
  const episodeRepository = getRepository(Episode);

  const mongoPodcasts = await PodcastModel.find().sort({
    createdAt: 1,
  });

  console.log(`Migrating ${mongoPodcasts.length} podcasts`);

  for (let i = 0; i < mongoPodcasts.length; i += 1) {
    const mongoPodcast = mongoPodcasts[i];

    console.log(`Migrating ${mongoPodcast.name}`);

    const postgresPodcast = podcastRepository.create({
      name: mongoPodcast.name,
      description: mongoPodcast.description,
      feedUrl: mongoPodcast.feedUrl,
      imageUrl: mongoPodcast.imageUrl,
      isServiceAvailable: mongoPodcast.isServiceAvailable,
      lastSuccessfulHealthcheckAt: mongoPodcast.lastSuccessfulHealthcheckAt,
      textColor: mongoPodcast.textColor,
      themeColor: mongoPodcast.themeColor,
      websiteUrl: mongoPodcast.websiteUrl,
      createdAt: mongoPodcast.createdAt,
      updatedAt: mongoPodcast.updatedAt,
    });

    await podcastRepository.save(postgresPodcast);

    console.log(`Migrating ${mongoPodcast.episodes.length} episodes`);

    const episodes: Episode[] = [];

    for (let j = 0; j < mongoPodcast.episodes.length; j += 1) {
      const mongoEpisode = mongoPodcast.episodes[j];

      const postgresEpisode = episodeRepository.create({
        title: mongoEpisode.title,
        description: mongoEpisode.description,
        createdAt: mongoEpisode.createdAt,
        date: mongoEpisode.date,
        duration: mongoEpisode.duration,
        existsOnFeed: mongoEpisode.existsOnFeed,
        image: mongoEpisode.image,
        mediaType: mongoEpisode.file.mediaType,
        podcastId: postgresPodcast.id,
        sizeBytes: mongoEpisode.file.sizeBytes,
        updatedAt: mongoEpisode.updatedAt,
        url: mongoEpisode.file.url,
      });

      episodes.push(postgresEpisode);
    }

    await episodeRepository.save(episodes);
  }

  console.log(`Finished`);

  exit();
});
