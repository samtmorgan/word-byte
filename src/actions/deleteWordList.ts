'use server';

import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';

export async function deleteWordList(wordSetId: string): Promise<void> {
  const user = await initialiseUser();
  if (!user) throw new Error("couldn't initialise user");

  const wordSets = user.wordSets.filter(ws => ws.wordSetId !== wordSetId);
  await updateUserWordsAndWordSets({ words: user.words, wordSets, userPlatformId: user.userPlatformId });
}
