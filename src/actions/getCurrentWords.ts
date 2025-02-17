'use server';

import { initialiseUser } from './initUser';
import { User, Word } from './types';

export async function getCurrentWords(): Promise<Word[] | null> {
  const user: User | null = await initialiseUser();

  const currentWords = user?.wordSets[0]?.wordIds
    .map(wordId => user.words.find(word => word.wordId === wordId))
    .filter(word => word !== undefined) as Word[];

  if (!currentWords) return null;

  return currentWords;
}
