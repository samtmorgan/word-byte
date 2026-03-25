'use server';

import { initialiseUser } from './initUser';
import { Word, WordOwner } from './types';

export async function getUserWords(): Promise<Word[]> {
  const user = await initialiseUser();
  if (!user) {
    return [];
  }

  return user.words.filter(word => word.owner === WordOwner.USER);
}
