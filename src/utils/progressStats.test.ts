import { Word, WordOwner } from '../actions/types';
import { getWordProgress } from './progressStats';

const makeWord = (results: { created: number; pass: boolean }[] = []): Word => ({
  word: 'test',
  wordId: 'id1',
  owner: WordOwner.PLATFORM,
  results,
});

const now = Date.now();

describe('getWordProgress', () => {
  it('returns zeros and null successRate for a word with no results', () => {
    const result = getWordProgress(makeWord([]));
    expect(result).toEqual({ attempts: 0, passes: 0, fails: 0, successRate: null, recentStreak: [] });
  });

  it('counts attempts, passes, fails and successRate correctly for mixed results', () => {
    const results = [
      { created: now - 5000, pass: true },
      { created: now - 4000, pass: true },
      { created: now - 3000, pass: true },
      { created: now - 2000, pass: false },
      { created: now - 1000, pass: false },
    ];
    const result = getWordProgress(makeWord(results));
    expect(result.attempts).toBe(5);
    expect(result.passes).toBe(3);
    expect(result.fails).toBe(2);
    expect(result.successRate).toBe(60);
  });

  it('returns the last 3 results sorted by recency (most recent first) as the streak', () => {
    const results = [
      { created: now - 5000, pass: true },
      { created: now - 4000, pass: false },
      { created: now - 3000, pass: true },
      { created: now - 2000, pass: false },
      { created: now - 1000, pass: true },
    ];
    const result = getWordProgress(makeWord(results));
    expect(result.recentStreak).toEqual([true, false, true]);
  });

  it('returns a streak shorter than 3 when fewer than 3 results exist', () => {
    const results = [
      { created: now - 2000, pass: true },
      { created: now - 1000, pass: false },
    ];
    const result = getWordProgress(makeWord(results));
    expect(result.recentStreak).toHaveLength(2);
    expect(result.recentStreak).toEqual([false, true]);
  });

  it('returns 100 successRate and all-true streak when all results are passes', () => {
    const results = [
      { created: now - 3000, pass: true },
      { created: now - 2000, pass: true },
      { created: now - 1000, pass: true },
    ];
    const result = getWordProgress(makeWord(results));
    expect(result.successRate).toBe(100);
    expect(result.recentStreak).toEqual([true, true, true]);
  });

  it('returns 0 successRate and all-false streak when all results are fails', () => {
    const results = [
      { created: now - 3000, pass: false },
      { created: now - 2000, pass: false },
      { created: now - 1000, pass: false },
    ];
    const result = getWordProgress(makeWord(results));
    expect(result.successRate).toBe(0);
    expect(result.recentStreak).toEqual([false, false, false]);
  });

  it('truncates streak to exactly 3 when more than 3 results exist', () => {
    const results = Array.from({ length: 10 }, (_, i) => ({ created: now - (10 - i) * 1000, pass: i % 2 === 0 }));
    const result = getWordProgress(makeWord(results));
    expect(result.recentStreak).toHaveLength(3);
  });
});
