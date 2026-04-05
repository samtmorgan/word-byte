'use server';

import { v4 } from 'uuid';
import { initialiseUser } from './initUser';
import { Word, WordOwner } from './types';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { validateWord } from '../utils/validation';

export type AddUserWordResult = { success: boolean; error?: 'duplicate' | 'init_failed' | 'invalid' };

export async function addUserWord(word: string): Promise<AddUserWordResult> {
  if (!validateWord(word)) {
    return { success: false, error: 'invalid' as const };
  }
  const user = await initialiseUser();
  if (!user) {
    return { success: false, error: 'init_failed' };
  }

  const isDuplicate = user.words.some(w => w.word.toLowerCase() === word.toLowerCase());
  if (isDuplicate) {
    return { success: false, error: 'duplicate' };
  }

  const newWord: Word = {
    word,
    wordId: v4(),
    owner: WordOwner.USER,
    results: [],
  };

  const words: Word[] = [...user.words, newWord];

  await updateUserWordsAndWordSets({ words, wordSets: user.wordSets, userPlatformId: user.userPlatformId });

  return { success: true };
}
