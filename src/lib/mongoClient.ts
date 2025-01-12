import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: 'word-byte' };

/* eslint-disable import/no-mutable-exports */
let client: MongoClient;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    mongoClient?: MongoClient;
  };

  if (!globalWithMongo.mongoClient) {
    globalWithMongo.mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo.mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

export default client;
