'use server';

import { LocalResults } from '../components/review/types';
import { mapResultsToUserWords } from '../utils/mapResultsToUserWords';
import { initialiseUser } from './initUser';
import { updateUserWords } from './updateUserWords';

export async function addTestResults(localResults: LocalResults) {
  const user = await initialiseUser();
  if (!user) {
    throw new Error("couldn't initialise user");
  }
  const updatedWords = mapResultsToUserWords({
    localResults,
    userWords: user.words,
  });
  user.words = updatedWords;

  await updateUserWords({ words: user.words, userPlatformId: user.userPlatformId });
}
