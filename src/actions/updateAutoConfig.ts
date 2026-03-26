'use server';

import { initialiseUser } from './initUser';
import { updateAutoWordSet } from './updateAutoWordSet';
import { YearGroup } from './types';
import { buildInitialAutoWordSet } from './autoWordUtils';

export async function updateAutoConfig(config: { yearGroups: YearGroup[]; includeUserWords: boolean }): Promise<void> {
  const user = await initialiseUser();
  if (!user) throw new Error("couldn't initialise user");

  const newAutoSet = buildInitialAutoWordSet(user.words, config.yearGroups, config.includeUserWords);

  await updateAutoWordSet({
    autoWordSet: newAutoSet.map(w => w.wordId),
    userPlatformId: user.userPlatformId,
    autoConfig: { yearGroups: config.yearGroups, includeUserWords: config.includeUserWords },
  });
}
