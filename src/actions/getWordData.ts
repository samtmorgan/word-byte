'use server';

import { initialiseUser } from './initUser';
import { User, Word, WordSet } from './types';
import { buildWordSetData } from '../utils/buildWordSetData';

type GetWordDataPayload = {
  currentWords: Word[];
  wordSets: WordSet[];
  words: Word[];
};

export async function getWordData(): Promise<GetWordDataPayload | null> {
  const user: User | null = await initialiseUser();

  if (!user) return null;

  const currentWords = buildWordSetData(user.wordSets, user.words, 0);

  return {
    currentWords,
    wordSets: user.wordSets,
    words: user.words,
  };
}
