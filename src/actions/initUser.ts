'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { DbUser, getUser } from './getUser';
import { createUser } from './createUser';

export type AuthUser = {
  userAuthId: string;
  username: string;
};

export interface User extends DbUser {
  username: string;
}

export async function initialiseUser(): Promise<User | null> {
  const { userId: userAuthId } = await auth();

  if (!userAuthId) {
    throw new Error('no auth userAuthId found');
  }

  const authClient = await clerkClient();
  const { username } = await authClient.users.getUser(userAuthId);

  if (!username) {
    throw new Error('no auth username found');
  }

  let dbUser = await getUser(userAuthId);

  if (!dbUser) {
    dbUser = await createUser(userAuthId);

    if (!dbUser) {
      throw new Error('failed to write new user to db');
    }
  }

  const user = JSON.parse(JSON.stringify(dbUser)) as User;
  user.username = username;

  // used to debug the loading state
  // await new Promise(resolve => setTimeout(resolve, 2000));

  return user;
}
