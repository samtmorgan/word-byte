'use server';

import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';

export async function promoteWordList(wordSetId: string): Promise<void> {
  const user = await initialiseUser();
  if (!user) throw new Error("couldn't initialise user");

  const target = user.wordSets.find(ws => ws.wordSetId === wordSetId);
  if (!target) return;

  const rest = user.wordSets.filter(ws => ws.wordSetId !== wordSetId);
  const wordSets = [target, ...rest];
  await updateUserWordsAndWordSets({ words: user.words, wordSets, userPlatformId: user.userPlatformId });
}
