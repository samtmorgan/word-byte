import { filterWordsByYearGroups, buildInitialAutoWordSet, buildRefreshWordPool } from './autoWordUtils';
import { WordOwner, Word } from './types';
import { initAutoWordSet, AUTO_WORD_SET_SIZE } from '../utils/wordSelection';

jest.mock('../utils/wordSelection', () => ({
  AUTO_WORD_SET_SIZE: 10,
  initAutoWordSet: jest.fn((_words: Word[], count: number) => _words.slice(0, count)),
}));

const platformWord34: Word = {
  word: 'apple',
  wordId: 'p1',
  owner: WordOwner.PLATFORM,
  results: [],
  yearGroup: 'year3_4',
};
const platformWord56: Word = {
  word: 'banana',
  wordId: 'p2',
  owner: WordOwner.PLATFORM,
  results: [],
  yearGroup: 'year5_6',
};
const userWord: Word = { word: 'custom', wordId: 'u1', owner: WordOwner.USER, results: [] };

describe('filterWordsByYearGroups', () => {
  it('excludes USER owner words', () => {
    const result = filterWordsByYearGroups([platformWord34, userWord], ['year3_4']);
    expect(result).toEqual([platformWord34]);
  });

  it('filters by specified year groups', () => {
    const result = filterWordsByYearGroups([platformWord34, platformWord56], ['year5_6']);
    expect(result).toEqual([platformWord56]);
  });

  it('returns empty array when no matches', () => {
    const result = filterWordsByYearGroups([platformWord34], ['year5_6']);
    expect(result).toEqual([]);
  });

  it('includes multiple year groups', () => {
    const result = filterWordsByYearGroups([platformWord34, platformWord56], ['year3_4', 'year5_6']);
    expect(result).toEqual([platformWord34, platformWord56]);
  });
});

describe('buildInitialAutoWordSet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('distributes slots between user and platform words', () => {
    buildInitialAutoWordSet([platformWord34, userWord], ['year3_4'], true);

    expect(initAutoWordSet).toHaveBeenCalledTimes(2);
    expect(initAutoWordSet).toHaveBeenCalledWith([userWord], 1);
    expect(initAutoWordSet).toHaveBeenCalledWith([platformWord34], AUTO_WORD_SET_SIZE - 1);
  });

  it('uses all slots for platform words when includeUserWords is false', () => {
    buildInitialAutoWordSet([platformWord34, userWord], ['year3_4'], false);

    expect(initAutoWordSet).toHaveBeenCalledWith([], 0);
    expect(initAutoWordSet).toHaveBeenCalledWith([platformWord34], AUTO_WORD_SET_SIZE);
  });

  it('handles empty words array', () => {
    const result = buildInitialAutoWordSet([], ['year3_4'], true);
    expect(result).toEqual([]);
  });
});

describe('buildRefreshWordPool', () => {
  it('combines user and platform words when includeUserWords is true', () => {
    const result = buildRefreshWordPool([platformWord34, platformWord56, userWord], ['year3_4'], true);
    expect(result).toEqual([userWord, platformWord34]);
  });

  it('excludes user words when includeUserWords is false', () => {
    const result = buildRefreshWordPool([platformWord34, userWord], ['year3_4'], false);
    expect(result).toEqual([platformWord34]);
  });
});
