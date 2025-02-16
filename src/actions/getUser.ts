'use server';

import { getMongoDB } from '../lib/mongoDB';

export interface Result {
  created: number;
  pass: boolean;
}

export interface Word {
  word: string;
  wordId: string;
  owner: 'platform' | 'user';
  results: Result[];
}

export interface WordSet {
  wordSetId: string;
  createdAt: number;
  wordIds: string[];
}

export interface DbUser {
  _id: string;
  userAuthId: string;
  userPlatformId: string;
  createdAt: number;
  wordSets: WordSet[];
  words: Word[];
}

export async function getUser(userAuthId: string): Promise<DbUser | null> {
  const db = await getMongoDB();
  const user = (await db.collection('users').findOne({ userAuthId })) as DbUser | null;

  return user;
}
