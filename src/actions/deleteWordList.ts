'use server';

import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { validateUUID } from '../utils/validation';

export async function deleteWordList(wordSetId: string): Promise<void> {
  if (!validateUUID(wordSetId)) {
    throw new Error('Invalid word set ID');
  }
  const user = await initialiseUser();
  if (!user) throw new Error("couldn't initialise user");

  const wordSets = user.wordSets.filter(ws => ws.wordSetId !== wordSetId);
  await updateUserWordsAndWordSets({ words: user.words, wordSets, userPlatformId: user.userPlatformId });
}
