import { Document, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import BaseSchema from '../../../shared/infra/mongoose/helpers/BaseSchema';

export const PodcastSchema = new BaseSchema(
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
  },
  {
    timestamps: true,
  },
);

PodcastSchema.plugin(mongoosePaginate);

export interface IPodcast {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  feedUrl: string;
  websiteUrl?: string;
  isServiceAvailable?: boolean;
  lastSuccessfulHealthcheckAt?: Date;
  themeColor?: string;
  textColor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPodcastModel extends Omit<IPodcast, 'id'>, Document {}

export default model('PodcastModel', PodcastSchema, 'podcasts');
