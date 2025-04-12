import client from './mongoClient';

export async function getMongoDB(): Promise<any> {
  if (!process.env.MONGODB_DB) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_DB"');
  }

  const dbName = process.env.MONGODB_DB;
  const mongoClient = await client.connect();
  const db = mongoClient.db(dbName);
  return db;
}
