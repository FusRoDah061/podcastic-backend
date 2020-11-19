import { Document, Model, model, Schema, Types } from 'mongoose';

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

interface IEpisodeFile {
  url: string;
  mediaType: string | undefined;
  length: string | undefined;
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

interface IEpisode {
  title: string;
  description: string;
  date: Date | null;
  image: string;
  file: IEpisodeFile;
}

export interface IEpisodeDocument extends IEpisode, Document {}

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
  name: string;
  description: string;
  imageUrl: string;
  feedUrl: string;
  websiteUrl?: string;
  episodes: Array<IEpisode>;
}

export interface IPodcastDocument extends IPodcast, Document {
  episodes: Types.Array<IEpisodeDocument>;
}

export type IPodcastModel = Model<IPodcastDocument>;

export default model<IPodcastDocument, IPodcastModel>(
  'PodcastModel',
  PodcastSchema,
  'podcasts',
);
