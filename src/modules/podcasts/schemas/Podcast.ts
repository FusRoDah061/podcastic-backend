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
    length: {
      type: String,
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
  length: number;
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
  episodes: Array<IEpisode>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IPodcastBaseDocument extends IPodcast {
  _id: any;
}

export interface IPodcastDocument extends IPodcastBaseDocument, Document {}

export type IPodcastModel = Model<IPodcastDocument>;

export default model<IPodcastDocument, IPodcastModel>(
  'PodcastModel',
  PodcastSchema,
  'podcasts',
);
