'use server';

import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';

export async function deleteUserWord(wordId: string): Promise<void> {
  const user = await initialiseUser();
  if (!user) {
    throw new Error("couldn't initialise user");
  }

  const words = user.words.filter(w => w.wordId !== wordId);

  const wordSets = user.wordSets.map(wordSet => ({
    ...wordSet,
    wordIds: wordSet.wordIds.filter(id => id !== wordId),
  }));

  await updateUserWordsAndWordSets({ words, wordSets, userPlatformId: user.userPlatformId });
}
