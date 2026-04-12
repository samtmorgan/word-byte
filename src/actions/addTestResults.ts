'use server';

import { LocalResults, Word } from './types';
import { mapResultsToUserWords } from '../utils/mapResultsToUserWords';
import { initialiseUser } from './initUser';
import { updateUserWords } from './updateUserWords';
import { updateAutoWordSet } from './updateAutoWordSet';
import { refreshAutoWordSet } from '../utils/wordSelection';
import { DEFAULT_YEAR_GROUPS, buildRefreshWordPool } from './autoWordUtils';
import { ActionResult, fail, ok, safeAction } from './actionResult';
import { addTestResultsSchema } from './schemas';

export async function addTestResults(input: {
  localResults: LocalResults;
  isAutoMode?: boolean;
}): Promise<ActionResult> {
  return safeAction(addTestResultsSchema, input, async ({ localResults, isAutoMode }) => {
    const user = await initialiseUser();
    if (!user) return fail('INIT_FAILED', "Couldn't initialise user");

    const updatedWords = mapResultsToUserWords({
      localResults,
      userWords: user.words,
    });
    user.words = updatedWords;

    await updateUserWords({ words: user.words, userPlatformId: user.userPlatformId });

    if (isAutoMode && user.autoWordSet && user.autoWordSet.length > 0) {
      const yearGroups = user.autoConfig?.yearGroups ?? DEFAULT_YEAR_GROUPS;
      const includeUserWords = user.autoConfig?.includeUserWords ?? false;
      const filteredWords = buildRefreshWordPool(user.words, yearGroups, includeUserWords);

      const currentSet = user.autoWordSet
        .map(id => user.words.find(w => w.wordId === id))
        .filter((w): w is Word => w !== undefined);

      const newSet = refreshAutoWordSet(currentSet, filteredWords);

      await updateAutoWordSet({
        autoWordSet: newSet.map(w => w.wordId),
        userPlatformId: user.userPlatformId,
      });
    }

    return ok();
  });
}
