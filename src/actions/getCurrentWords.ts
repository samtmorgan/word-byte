'use server';

import { Word } from './getUser';
import { User, initialiseUser } from './initUser';

export async function getCurrentWords(): Promise<Word[] | null> {
  const user: User | null = await initialiseUser();

  const currentWords = user?.wordSets[0]?.wordIds
    .map(wordId => user.words.find(word => word.wordId === wordId))
    .filter(word => word !== undefined) as Word[];

  if (!currentWords) return null;

  return currentWords;
}
