import { Document, model } from 'mongoose';
import BaseSchema from '../../../shared/infra/mongoose/helpers/BaseSchema';

export const EpisodeSchema = new BaseSchema(
  {
    podcastId: {
      type: String,
      required: true,
    },
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
      required: false,
    },
    existsOnFeed: {
      type: Boolean,
      required: false,
      default: true,
    },
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
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export interface IEpisode {
  id: string;
  podcastId: string;
  title: string;
  description: string;
  date: Date;
  image: string;
  duration: string;
  existsOnFeed?: boolean;
  url: string;
  mediaType: string;
  sizeBytes: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEpisodeModel extends Omit<IEpisode, 'id'>, Document {}

export default model<IEpisodeModel>('EpisodeModel', EpisodeSchema, 'episodes');
