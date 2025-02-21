'use server';

import { initialiseUser } from './initUser';
import { User, Word } from './types';
import { buildWordSetData } from '../utils/buildWordSetData';

type GetWordDataPayload = {
  currentWords: Word[];
  wordSets: User['wordSets'];
  words: User['words'];
  username: User['username'];
  userPlatformId: User['userPlatformId'];
};

export async function getWordData(): Promise<GetWordDataPayload | null> {
  const user: User | null = await initialiseUser();

  if (!user) return null;

  const currentWords = buildWordSetData(user.wordSets, user.words, 0);

  const payload: GetWordDataPayload = {
    currentWords,
    wordSets: user.wordSets,
    words: user.words,
    username: user.username,
    userPlatformId: user.userPlatformId,
  };

  return payload;
}
