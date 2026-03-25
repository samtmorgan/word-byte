'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { getUser } from './getUser';
import { createUser } from './createUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { updateAutoWordSet } from './updateAutoWordSet';
import { updateUserMode } from './updateUserMode';
import { User, DATA_VERSION } from './types';
import { defaultWords, defaultWordSets } from '../constants';

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
    if (dbUser.dataVersion !== DATA_VERSION) {
      await updateUserWordsAndWordSets({
        words: [...defaultWords],
        wordSets: [...defaultWordSets],
        userPlatformId: dbUser.userPlatformId,
      });
      await updateAutoWordSet({
        autoWordSet: [],
        userPlatformId: dbUser.userPlatformId,
        dataVersion: DATA_VERSION,
      });
      dbUser.words = [...defaultWords];
      dbUser.wordSets = [...defaultWordSets];
      dbUser.autoWordSet = [];
      dbUser.dataVersion = DATA_VERSION;
    }

    if (!dbUser.mode || !dbUser.autoConfig) {
      const migratedMode = dbUser.mode ?? 'auto';
      const migratedAutoConfig = dbUser.autoConfig ?? { yearGroups: ['year3_4', 'year5_6'] };
      await updateUserMode({
        userPlatformId: dbUser.userPlatformId,
        mode: migratedMode,
        autoConfig: migratedAutoConfig,
      });
      dbUser.mode = migratedMode;
      dbUser.autoConfig = migratedAutoConfig;
    }
  }

  const user = JSON.parse(JSON.stringify(dbUser)) as User;
  user.username = username;

  return user;
}
