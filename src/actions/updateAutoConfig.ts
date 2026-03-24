'use server';

import { initialiseUser } from './initUser';
import { updateAutoWordSet } from './updateAutoWordSet';
import { initAutoWordSet } from '../utils/wordSelection';
import { YearGroup } from './types';
import { filterWordsByYearGroups } from './getAutoWords';

export async function updateAutoConfig(yearGroups: YearGroup[]): Promise<void> {
  const user = await initialiseUser();
  if (!user) throw new Error("couldn't initialise user");

  const filteredWords = filterWordsByYearGroups(user.words, yearGroups);
  const newAutoSet = initAutoWordSet(filteredWords);

  await updateAutoWordSet({
    autoWordSet: newAutoSet.map(w => w.wordId),
    userPlatformId: user.userPlatformId,
    autoConfig: { yearGroups },
  });
}
