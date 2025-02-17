'use server';

import { getMongoDB } from '../lib/mongoDB';
import { DbUser } from './types';

export async function getUser(userAuthId: string): Promise<DbUser | null> {
  const db = await getMongoDB();
  const user = (await db.collection('users').findOne({ userAuthId })) as DbUser | null;

  return user;
}
