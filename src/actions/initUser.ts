'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { getUser } from './getUser';
import { createUser } from './createUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { User } from './types';
import { defaultWords } from '../constants';

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
  } else {
    const existingWordIds = new Set(dbUser.words.map(w => w.wordId));
    const newWords = defaultWords.filter(w => !existingWordIds.has(w.wordId));

    if (newWords.length > 0) {
      const updatedWords = [...dbUser.words, ...newWords];
      await updateUserWordsAndWordSets({
        words: updatedWords,
        wordSets: dbUser.wordSets,
        userPlatformId: dbUser.userPlatformId,
      });
      dbUser.words = updatedWords;
    }
  }

  const user = JSON.parse(JSON.stringify(dbUser)) as User;
  user.username = username;

  return user;
}
