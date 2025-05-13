'use server';

import { getMongoDB } from '../lib/mongoDB';
import { Word, WordSet } from './types';

type UpdateUserWordsProps = {
  words: Word[];
  wordSets: WordSet[];
  userPlatformId: string;
};

export async function updateUserWordsAndWordSets({
  words,
  wordSets,
  userPlatformId,
}: UpdateUserWordsProps): Promise<void> {
  const db = await getMongoDB();

  const users = db.collection('users');

  await users.updateOne(
    { userPlatformId },
    {
      $set: {
        words,
        wordSets,
      },
    },
  );
}
