'use server';

import { getMongoDB } from '../lib/mongoDB';
import { Word } from './types';

type UpdateUserWordsProps = {
  words: Word[];
  userPlatformId: string;
};

export async function updateUserWords({ words, userPlatformId }: UpdateUserWordsProps): Promise<void> {
  const db = await getMongoDB();

  const users = db.collection('users');

  await users.updateOne(
    { userPlatformId },
    {
      $set: {
        words,
      },
    },
  );
}
