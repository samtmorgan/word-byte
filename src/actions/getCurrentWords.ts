'use server';

import { buildWordSetData } from '../utils/buildWordSetData';
import { initialiseUser } from './initUser';
import { User, Word } from './types';

export async function getCurrentWords(): Promise<Word[] | null> {
  const user: User | null = await initialiseUser();

  if (!user) return null;

  const currentWords = buildWordSetData(user?.wordSets, user?.words, 0);

  if (!currentWords) return null;

  return currentWords;
}
