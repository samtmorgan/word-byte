'use server';

import { initialiseUser } from './initUser';
import { updateAutoWordSet } from './updateAutoWordSet';
import { initAutoWordSet } from '../utils/wordSelection';
import { Word, YearGroup } from './types';
import { DEFAULT_YEAR_GROUPS, filterWordsByYearGroups } from './autoWordUtils';

export type GetAutoWordsResult = {
  words: Word[];
  isEmpty: boolean;
  yearGroups: YearGroup[];
};

export async function getAutoWords(): Promise<GetAutoWordsResult> {
  const user = await initialiseUser();
  if (!user) return { words: [], isEmpty: false, yearGroups: DEFAULT_YEAR_GROUPS };

  const yearGroups = user.autoConfig?.yearGroups ?? DEFAULT_YEAR_GROUPS;
  const filteredWords = filterWordsByYearGroups(user.words, yearGroups);

  let autoWordSetIds = user.autoWordSet;

  if (!autoWordSetIds || autoWordSetIds.length === 0) {
    const newAutoSet = initAutoWordSet(filteredWords);
    if (newAutoSet.length === 0) {
      return { words: [], isEmpty: true, yearGroups };
    }
    autoWordSetIds = newAutoSet.map(w => w.wordId);
    await updateAutoWordSet({ autoWordSet: autoWordSetIds, userPlatformId: user.userPlatformId });
    return { words: newAutoSet, isEmpty: false, yearGroups };
  }

  const words = autoWordSetIds
    .map(id => user.words.find(w => w.wordId === id))
    .filter((w): w is Word => w !== undefined);

  return { words, isEmpty: words.length === 0, yearGroups };
}
