'use server';

import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { ActionResult, fail, ok, safeAction } from './actionResult';
import { promoteWordListSchema } from './schemas';

export async function promoteWordList(wordSetId: string): Promise<ActionResult> {
  return safeAction(promoteWordListSchema, wordSetId, async validId => {
    const user = await initialiseUser();
    if (!user) return fail('INIT_FAILED', "Couldn't initialise user");

    const target = user.wordSets.find(ws => ws.wordSetId === validId);
    if (!target) return ok();

    const rest = user.wordSets.filter(ws => ws.wordSetId !== validId);
    const wordSets = [target, ...rest];
    await updateUserWordsAndWordSets({ words: user.words, wordSets, userPlatformId: user.userPlatformId });
    return ok();
  });
}
