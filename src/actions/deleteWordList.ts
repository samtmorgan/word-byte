'use server';

import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { ActionResult, fail, ok, safeAction } from './actionResult';
import { deleteWordListSchema } from './schemas';

export async function deleteWordList(wordSetId: string): Promise<ActionResult> {
  return safeAction(deleteWordListSchema, wordSetId, async validId => {
    const user = await initialiseUser();
    if (!user) return fail('INIT_FAILED', "Couldn't initialise user");

    const wordSets = user.wordSets.filter(ws => ws.wordSetId !== validId);
    await updateUserWordsAndWordSets({ words: user.words, wordSets, userPlatformId: user.userPlatformId });
    return ok();
  });
}
