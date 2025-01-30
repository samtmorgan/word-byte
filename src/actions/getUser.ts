import client from '../lib/mongoClient';

interface Result {
  created: number;
  pass: boolean;
}

export interface Word {
  word: string;
  wordId: string;
  owner: 'platform' | 'user';
  results: Result[];
}

interface WordSet {
  wordSetId: string;
  createdAt: number;
  wordIds: string[];
}

export interface User {
  _id: string;
  userAuthId: string;
  userPlatformId: string;
  userName: string;
  createdAt: 1735938406366;
  wordSets: WordSet[];
  words: Word[];
}

export async function getUser(userAuthId: string): Promise<User | null> {
  const mongoClient = await client.connect();
  const db = mongoClient.db('wordByteTest');
  const user = (await db.collection('users').findOne({ userAuthId })) as User | null;

  return user;
}
