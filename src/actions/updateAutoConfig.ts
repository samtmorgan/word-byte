'use server';

import { initialiseUser } from './initUser';
import { updateAutoWordSet } from './updateAutoWordSet';
import { YearGroup } from './types';
import { buildInitialAutoWordSet } from './autoWordUtils';
import { ActionResult, fail, ok, safeAction } from './actionResult';
import { updateAutoConfigSchema } from './schemas';

export async function updateAutoConfig(config: {
  yearGroups: YearGroup[];
  includeUserWords: boolean;
}): Promise<ActionResult> {
  return safeAction(updateAutoConfigSchema, config, async validConfig => {
    const user = await initialiseUser();
    if (!user) return fail('INIT_FAILED', "Couldn't initialise user");

    const newAutoSet = buildInitialAutoWordSet(user.words, validConfig.yearGroups, validConfig.includeUserWords);

    await updateAutoWordSet({
      autoWordSet: newAutoSet.map(w => w.wordId),
      userPlatformId: user.userPlatformId,
      autoConfig: { yearGroups: validConfig.yearGroups, includeUserWords: validConfig.includeUserWords },
    });
    return ok();
  });
}
