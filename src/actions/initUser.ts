'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { getUser } from './getUser';

export type AuthUser = {
  userId: string;
  username: string;
};

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

export interface DbUser {
  _id: string;
  userAuthId: string;
  userPlatformId: string;
  createdAt: 1735938406366;
  wordSets: WordSet[];
  words: Word[];
}

export interface User extends DbUser {
  username: string;
}

export default async function initUser(): Promise<User | null> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('no auth userId found');
  }

  const authClient = await clerkClient();
  const { username } = await authClient.users.getUser(userId);

  if (!username) {
    throw new Error('no auth username found');
  }

  const dbUser = await getUser(userId);

  if (!dbUser) {
    throw new Error('no user found');
  }

  const user = JSON.parse(JSON.stringify(dbUser)) as User;
  user.username = username;
  // console.log('user', user);

  // used to debug the loading state
  // await new Promise(resolve => setTimeout(resolve, 2000));

  return user;
}
