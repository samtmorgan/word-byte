import { Word, WordOwner, YearGroup } from './types';
import { initAutoWordSet, AUTO_WORD_SET_SIZE } from '../utils/wordSelection';

export const DEFAULT_YEAR_GROUPS: YearGroup[] = ['year3_4', 'year5_6'];

export function filterWordsByYearGroups(words: Word[], yearGroups: YearGroup[]): Word[] {
  return words.filter(w => w.owner !== WordOwner.USER && yearGroups.includes(w.yearGroup!));
}

export function buildInitialAutoWordSet(words: Word[], yearGroups: YearGroup[], includeUserWords: boolean): Word[] {
  const userWords = includeUserWords ? words.filter(w => w.owner === WordOwner.USER) : [];
  const platformWords = filterWordsByYearGroups(words, yearGroups);

  const userSlots = Math.min(userWords.length, AUTO_WORD_SET_SIZE);
  const platformSlots = AUTO_WORD_SET_SIZE - userSlots;

  return [
    ...initAutoWordSet(userWords, userSlots),
    ...(platformSlots > 0 ? initAutoWordSet(platformWords, platformSlots) : []),
  ];
}

export function buildRefreshWordPool(words: Word[], yearGroups: YearGroup[], includeUserWords: boolean): Word[] {
  const userWords = includeUserWords ? words.filter(w => w.owner === WordOwner.USER) : [];
  const platformWords = filterWordsByYearGroups(words, yearGroups);
  return [...userWords, ...platformWords];
}
