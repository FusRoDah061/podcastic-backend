import { Document, Model, model, Schema } from 'mongoose';

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

export interface IEpisodeFile {
  url: string;
  mediaType: string;
  sizeBytes: number;
}

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

export interface IEpisode {
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

export interface IEpisodeDocument extends IEpisodeBaseDocument, Document {}

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

export interface IPodcast {
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

export interface IPodcastDocument extends IPodcastBaseDocument, Document {}

export type IPodcastModel = Model<IPodcastDocument>;

export default model<IPodcastDocument, IPodcastModel>(
  'PodcastModel',
  PodcastSchema,
  'podcasts',
);
