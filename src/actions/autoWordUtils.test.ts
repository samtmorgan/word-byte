import { filterWordsByYearGroups, DEFAULT_YEAR_GROUPS } from './autoWordUtils';
import { Word, WordOwner, YearGroup } from './types';

const makeWord = (wordId: string, owner: WordOwner, yearGroup?: YearGroup): Word => ({
  wordId,
  word: wordId,
  owner,
  results: [],
  yearGroup,
});

describe('DEFAULT_YEAR_GROUPS', () => {
  it('should contain year3_4 and year5_6', () => {
    expect(DEFAULT_YEAR_GROUPS).toEqual(['year3_4', 'year5_6']);
  });
});

describe('filterWordsByYearGroups', () => {
  const year3Word = makeWord('w1', WordOwner.PLATFORM, 'year3_4');
  const year5Word = makeWord('w2', WordOwner.PLATFORM, 'year5_6');
  const noGroupWord = makeWord('w3', WordOwner.PLATFORM, undefined);
  const userWord = makeWord('w4', WordOwner.USER);

  it('should include platform words matching the given year groups', () => {
    const result = filterWordsByYearGroups([year3Word, year5Word], ['year3_4']);
    expect(result).toEqual([year3Word]);
  });

  it('should include platform words with no yearGroup when any group is specified', () => {
    const result = filterWordsByYearGroups([noGroupWord], ['year3_4']);
    expect(result).toEqual([noGroupWord]);
  });

  it('should exclude user words by default (includeUserWords = false)', () => {
    const result = filterWordsByYearGroups([userWord, year3Word], ['year3_4']);
    expect(result).not.toContain(userWord);
    expect(result).toContain(year3Word);
  });

  it('should include user words when includeUserWords is true', () => {
    const result = filterWordsByYearGroups([userWord, year3Word], ['year3_4'], true);
    expect(result).toContain(userWord);
    expect(result).toContain(year3Word);
  });

  it('should return empty array when no words match', () => {
    const result = filterWordsByYearGroups([year5Word], ['year3_4']);
    expect(result).toEqual([]);
  });

  it('should filter by both year groups when both are provided', () => {
    const result = filterWordsByYearGroups([year3Word, year5Word, userWord], ['year3_4', 'year5_6']);
    expect(result).toContain(year3Word);
    expect(result).toContain(year5Word);
    expect(result).not.toContain(userWord);
  });

  it('should return empty array when words array is empty', () => {
    const result = filterWordsByYearGroups([], ['year3_4', 'year5_6']);
    expect(result).toEqual([]);
  });
});
