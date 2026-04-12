'use server';

import { v4 } from 'uuid';
import { initialiseUser } from './initUser';
import { Word, WordOwner } from './types';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { ActionResult, fail, ok, safeAction } from './actionResult';
import { addUserWordSchema } from './schemas';

export async function addUserWord(word: string): Promise<ActionResult> {
  return safeAction(addUserWordSchema, word, async validWord => {
    const user = await initialiseUser();
    if (!user) return fail('INIT_FAILED', "Couldn't initialise user");

    const isDuplicate = user.words.some(
      w => w.word.toLowerCase() === validWord.toLowerCase() && w.owner === WordOwner.USER,
    );

    if (isDuplicate) {
      return fail('DUPLICATE', 'Word already exists');
    }

    const newWord: Word = {
      word: validWord,
      wordId: v4(),
      owner: WordOwner.USER,
      results: [],
    };

    const words: Word[] = [...user.words, newWord];

    await updateUserWordsAndWordSets({ words, wordSets: user.wordSets, userPlatformId: user.userPlatformId });

    return ok();
  });
}
