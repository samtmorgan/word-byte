'use server';

import { v4 } from 'uuid';
import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { Word, WordOwner, WordSet } from './types';
import { getTimeStamp } from '../utils/getTimeStamp';
import { ActionResult, fail, ok, safeAction } from './actionResult';
import { createWordListSchema } from './schemas';

export async function createWordList(input: {
  selectedWordIds: string[];
  newWordTexts: string[];
}): Promise<ActionResult> {
  return safeAction(createWordListSchema, input, async ({ selectedWordIds, newWordTexts }) => {
    const user = await initialiseUser();
    if (!user) return fail('INIT_FAILED', "Couldn't initialise user");

    // Create USER word objects for words that don't exist yet
    const existingWordTexts = new Set(user.words.map(w => w.word.toLowerCase()));
    const wordsToCreate = newWordTexts.filter(t => !existingWordTexts.has(t.toLowerCase()));

    const newWordObjects: Word[] = wordsToCreate.map(text => ({
      word: text,
      wordId: v4(),
      owner: WordOwner.USER,
      results: [],
    }));

    // Any "new" words that actually already exist — include their existing IDs
    const alreadyExistingIds = newWordTexts
      .filter(t => existingWordTexts.has(t.toLowerCase()))
      .map(t => user.words.find(w => w.word.toLowerCase() === t.toLowerCase())?.wordId)
      .filter((id): id is string => id !== undefined);

    const allWordIds = [...selectedWordIds, ...newWordObjects.map(w => w.wordId), ...alreadyExistingIds];
    const uniqueWordIds = Array.from(new Set(allWordIds));

    const newWordSet: WordSet = {
      wordSetId: v4(),
      createdAt: getTimeStamp(),
      wordIds: uniqueWordIds,
    };

    const words = [...user.words, ...newWordObjects];
    const wordSets = [newWordSet, ...user.wordSets];

    await updateUserWordsAndWordSets({ words, wordSets, userPlatformId: user.userPlatformId });
    return ok();
  });
}
