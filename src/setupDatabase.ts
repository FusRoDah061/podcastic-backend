import mongoose, { ConnectionOptions } from 'mongoose';

export default function setupDatabase(): Promise<typeof mongoose> {
  console.log('Setting up database connection...');

  const options: ConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  };

  const connection = mongoose.connect(process.env.MONGODB_URI || '', options);

  return connection;
}
