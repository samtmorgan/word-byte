import client from './mongoClient';

export async function getMongoDB(): Promise<any> {
  const mongoClient = await client.connect();
  const db = mongoClient.db('wordByteTest');
  return db;
}
