'use server';

import { LocalResults } from '../components/review/types';
import { mapResultsToUserWords } from '../utils/mapResultsToUserWords';
import { initialiseUser } from './initUser';
import { updateUserWords } from './updateUserWords';
import { updateAutoWordSet } from './updateAutoWordSet';
import { refreshAutoWordSet } from '../utils/wordSelection';
import { Word } from './types';
import { DEFAULT_YEAR_GROUPS, filterWordsByYearGroups } from './getAutoWords';

export async function addTestResults(localResults: LocalResults, isAutoMode = false) {
  const user = await initialiseUser();
  if (!user) {
    throw new Error("couldn't initialise user");
  }
  const updatedWords = mapResultsToUserWords({
    localResults,
    userWords: user.words,
  });
  user.words = updatedWords;

  await updateUserWords({ words: user.words, userPlatformId: user.userPlatformId });

  if (isAutoMode && user.autoWordSet && user.autoWordSet.length > 0) {
    const yearGroups = user.autoConfig?.yearGroups ?? DEFAULT_YEAR_GROUPS;
    const filteredWords = filterWordsByYearGroups(user.words, yearGroups);

    const currentSet = user.autoWordSet
      .map(id => user.words.find(w => w.wordId === id))
      .filter((w): w is Word => w !== undefined);

    const newSet = refreshAutoWordSet(currentSet, filteredWords);

    await updateAutoWordSet({
      autoWordSet: newSet.map(w => w.wordId),
      userPlatformId: user.userPlatformId,
    });
  }
}
