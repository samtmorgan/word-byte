import { Word, WordOwner, YearGroup } from './types';

export const DEFAULT_YEAR_GROUPS: YearGroup[] = ['year3_4', 'year5_6'];

export function filterWordsByYearGroups(words: Word[], yearGroups: YearGroup[], includeUserWords = false): Word[] {
  return words.filter(
    w =>
      (includeUserWords && w.owner === WordOwner.USER) ||
      (w.owner !== WordOwner.USER && (!w.yearGroup || yearGroups.includes(w.yearGroup))),
  );
}
