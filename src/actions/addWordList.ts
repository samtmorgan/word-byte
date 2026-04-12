'use server';

import { v4 } from 'uuid';
import { initialiseUser } from './initUser';
import { Word, WordOwner, WordSet } from './types';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { getTimeStamp } from '../utils/getTimeStamp';
import { ActionResult, fail, ok, safeAction } from './actionResult';
import { addWordListSchema } from './schemas';

export async function addWordList(newWords: string[]): Promise<ActionResult> {
  return safeAction(addWordListSchema, newWords, async validWords => {
    const user = await initialiseUser();
    if (!user) return fail('INIT_FAILED', "Couldn't initialise user");

    const newWordsToBeAdded: string[] = validWords.filter(
      newWord => !user.words.map(word => word.word).includes(newWord),
    );

    const newWordObjects: Word[] = newWordsToBeAdded.map(word => ({
      word,
      wordId: v4(),
      owner: WordOwner.USER,
      results: [],
    }));
    const words: Word[] = [...user.words, ...newWordObjects];

    const newWordIds: string[] = newWordObjects.map(word => word.wordId);

    const existingWordsForNewWordSet: Word[] = user.words.filter(word => validWords.includes(word.word));

    const existingWordIdsForNewWordSet: string[] = existingWordsForNewWordSet.map(word => word.wordId);

    const timestamp = getTimeStamp();

    const newWordSet: WordSet = {
      wordSetId: v4(),
      createdAt: timestamp,
      wordIds: [...newWordIds, ...existingWordIdsForNewWordSet],
    };

    const wordSets = [newWordSet, ...user.wordSets];

    await updateUserWordsAndWordSets({ words, wordSets, userPlatformId: user.userPlatformId });
    return ok();
  });
}
