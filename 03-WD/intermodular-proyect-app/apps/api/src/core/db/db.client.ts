import { MongoClient } from 'mongodb';
import { createEnvReader } from '#core/env';

const getEnv = createEnvReader(process.env);

export const client = new MongoClient(getEnv('MONGODB_URL'));
export const db = client.db();

export const connectDb = async () => {
  await client.connect();
  console.log('Connected to MongoDB');
};
