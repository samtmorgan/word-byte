'use server';

import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { ActionResult, fail, ok, safeAction } from './actionResult';
import { deleteUserWordSchema } from './schemas';

export async function deleteUserWord(wordId: string): Promise<ActionResult> {
  return safeAction(deleteUserWordSchema, wordId, async validId => {
    const user = await initialiseUser();
    if (!user) return fail('INIT_FAILED', "Couldn't initialise user");

    const words = user.words.filter(w => w.wordId !== validId);

    const wordSets = user.wordSets.map(wordSet => ({
      ...wordSet,
      wordIds: wordSet.wordIds.filter(id => id !== validId),
    }));

    await updateUserWordsAndWordSets({ words, wordSets, userPlatformId: user.userPlatformId });
    return ok();
  });
}
