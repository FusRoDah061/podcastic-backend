import mongoose from 'mongoose';
import { mongoConnectionOptions } from '../../../../setupDatabase';
import IDatabaseHealthcheckProvider from '../models/IDatabaseHealthcheckProvider';

export default class MongodbHealthcheckProvider
  implements IDatabaseHealthcheckProvider {
  public async ping(): Promise<void> {
    try {
      await mongoose.connect(
        process.env.MONGODB_URI || '',
        mongoConnectionOptions,
      );
    } catch (err) {
      throw new Error(`Could not reach mongo database: ${err.message}`);
    }
  }
}
