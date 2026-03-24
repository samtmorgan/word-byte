import { Word, WordOwner } from '../actions/types';
import {
  AUTO_WORD_SET_SIZE,
  COOLDOWN_DAYS,
  STREAK_THRESHOLD,
  calculateStreak,
  initAutoWordSet,
  isDueForResurface,
  isWordMastered,
  refreshAutoWordSet,
} from './wordSelection';

const DAY_MS = 24 * 60 * 60 * 1000;
const now = Date.now();

const makeWord = (wordId: string, results: { created: number; pass: boolean }[] = []): Word => ({
  word: wordId,
  wordId,
  owner: WordOwner.PLATFORM,
  results,
});

const masteredWord = (wordId: string): Word =>
  makeWord(wordId, [
    { created: now - 3000, pass: true },
    { created: now - 2000, pass: true },
    { created: now - 1000, pass: true },
  ]);

const masteredWordOld = (wordId: string): Word =>
  makeWord(wordId, [
    { created: now - (COOLDOWN_DAYS + 1) * DAY_MS - 3000, pass: true },
    { created: now - (COOLDOWN_DAYS + 1) * DAY_MS - 2000, pass: true },
    { created: now - (COOLDOWN_DAYS + 1) * DAY_MS - 1000, pass: true },
  ]);

const failedWord = (wordId: string): Word =>
  makeWord(wordId, [
    { created: now - 3000, pass: true },
    { created: now - 2000, pass: true },
    { created: now - 1000, pass: false },
  ]);

describe('calculateStreak', () => {
  it('returns 0 for empty results', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 0 when most recent result is a failure', () => {
    const results = [
      { created: now - 2000, pass: true },
      { created: now - 1000, pass: false },
    ];
    expect(calculateStreak(results)).toBe(0);
  });

  it('counts consecutive passes from most recent', () => {
    const results = [
      { created: now - 3000, pass: false },
      { created: now - 2000, pass: true },
      { created: now - 1000, pass: true },
    ];
    expect(calculateStreak(results)).toBe(2);
  });

  it('counts all results when all pass', () => {
    const results = [
      { created: now - 3000, pass: true },
      { created: now - 2000, pass: true },
      { created: now - 1000, pass: true },
    ];
    expect(calculateStreak(results)).toBe(3);
  });

  it('resets streak on failure', () => {
    const results = [
      { created: now - 5000, pass: true },
      { created: now - 4000, pass: true },
      { created: now - 3000, pass: true },
      { created: now - 2000, pass: false },
      { created: now - 1000, pass: true },
    ];
    expect(calculateStreak(results)).toBe(1);
  });

  it('handles unsorted results by sorting by timestamp', () => {
    const results = [
      { created: now - 1000, pass: true },
      { created: now - 3000, pass: false },
      { created: now - 2000, pass: true },
    ];
    expect(calculateStreak(results)).toBe(2);
  });

  it('returns 1 for a single passing result', () => {
    expect(calculateStreak([{ created: now, pass: true }])).toBe(1);
  });
});

describe('isWordMastered', () => {
  it('returns false for a word with no results', () => {
    expect(isWordMastered(makeWord('w1'))).toBe(false);
  });

  it('returns false when streak is below threshold', () => {
    const word = makeWord('w1', [
      { created: now - 2000, pass: true },
      { created: now - 1000, pass: true },
    ]);
    expect(isWordMastered(word)).toBe(false);
  });

  it(`returns true when streak equals ${STREAK_THRESHOLD}`, () => {
    expect(isWordMastered(masteredWord('w1'))).toBe(true);
  });

  it('returns false when streak broken by a failure', () => {
    expect(isWordMastered(failedWord('w1'))).toBe(false);
  });
});

describe('isDueForResurface', () => {
  it('returns false for unmastered word', () => {
    expect(isDueForResurface(failedWord('w1'))).toBe(false);
  });

  it('returns false for recently mastered word', () => {
    expect(isDueForResurface(masteredWord('w1'))).toBe(false);
  });

  it('returns true for mastered word tested more than cooldown days ago', () => {
    expect(isDueForResurface(masteredWordOld('w1'))).toBe(true);
  });

  it('respects a custom cooldown period', () => {
    const word = makeWord('w1', [
      { created: now - 2 * DAY_MS - 1000, pass: true },
      { created: now - 2 * DAY_MS - 500, pass: true },
      { created: now - 2 * DAY_MS, pass: true },
    ]);
    expect(isDueForResurface(word, 1)).toBe(true);
    expect(isDueForResurface(word, 3)).toBe(false);
  });
});

describe('initAutoWordSet', () => {
  it('returns up to count words from unmastered pool', () => {
    const words = Array.from({ length: 15 }, (_, i) => makeWord(`w${i}`));
    const set = initAutoWordSet(words, 10);
    expect(set).toHaveLength(10);
    set.forEach(w => expect(isWordMastered(w)).toBe(false));
  });

  it('includes words due for resurfacing when unmastered pool is too small', () => {
    const unmastered = [makeWord('u1'), makeWord('u2')];
    const resurface = [masteredWordOld('r1'), masteredWordOld('r2')];
    const recentMastered = [masteredWord('m1'), masteredWord('m2')];
    const words = [...unmastered, ...resurface, ...recentMastered];

    const set = initAutoWordSet(words, 4);
    expect(set).toHaveLength(4);
    const ids = set.map(w => w.wordId);
    expect(ids).toContain('u1');
    expect(ids).toContain('u2');
    expect(ids.some(id => id === 'r1' || id === 'r2')).toBe(true);
  });

  it('uses all words when pool is smaller than count', () => {
    const words = [makeWord('w1'), makeWord('w2')];
    const set = initAutoWordSet(words, 10);
    expect(set).toHaveLength(2);
  });

  it('uses configurable set size', () => {
    const words = Array.from({ length: 5 }, (_, i) => makeWord(`w${i}`));
    const set = initAutoWordSet(words, 3);
    expect(set).toHaveLength(3);
  });

  it(`defaults to AUTO_WORD_SET_SIZE of ${AUTO_WORD_SET_SIZE}`, () => {
    const words = Array.from({ length: 20 }, (_, i) => makeWord(`w${i}`));
    const set = initAutoWordSet(words);
    expect(set).toHaveLength(AUTO_WORD_SET_SIZE);
  });
});

describe('refreshAutoWordSet', () => {
  it('retains unmastered words from current set', () => {
    const current = [makeWord('u1'), makeWord('u2'), failedWord('f1')];
    const all = [...current, makeWord('new1'), makeWord('new2')];
    const set = refreshAutoWordSet(current, all, 3);
    const ids = set.map(w => w.wordId);
    expect(ids).toContain('u1');
    expect(ids).toContain('u2');
    expect(ids).toContain('f1');
  });

  it('replaces mastered words with new words', () => {
    const current = [masteredWord('m1'), masteredWord('m2'), makeWord('u1')];
    const all = [...current, makeWord('new1'), makeWord('new2')];
    const set = refreshAutoWordSet(current, all, 3);
    expect(set).toHaveLength(3);
    const ids = set.map(w => w.wordId);
    expect(ids).not.toContain('m1');
    expect(ids).not.toContain('m2');
    expect(ids).toContain('u1');
  });

  it('prioritises never-tested words over failed words', () => {
    const current = [masteredWord('m1')];
    const neverTested = makeWord('new1');
    const failed = failedWord('fail1');
    const all = [current[0], neverTested, failed];

    jest.spyOn(Math, 'random').mockReturnValue(0);
    const set = refreshAutoWordSet(current, all, 2);
    jest.spyOn(Math, 'random').mockRestore();

    const ids = set.map(w => w.wordId);
    expect(ids).toContain('new1');
  });

  it('falls back to failed words when no never-tested words are available', () => {
    const current = [masteredWord('m1')];
    const failed = failedWord('fail1');
    const all = [current[0], failed];
    const set = refreshAutoWordSet(current, all, 2);
    const ids = set.map(w => w.wordId);
    expect(ids).toContain('fail1');
  });

  it('falls back to resurfaceable mastered words when other pools exhausted', () => {
    const current = [masteredWord('m1')];
    const resurface = masteredWordOld('r1');
    const all = [current[0], resurface];
    const set = refreshAutoWordSet(current, all, 2);
    const ids = set.map(w => w.wordId);
    expect(ids).toContain('r1');
  });

  it('handles edge case: all words mastered and none due for resurfacing', () => {
    const current = [masteredWord('m1'), masteredWord('m2')];
    const all = [...current, masteredWord('m3')];
    const set = refreshAutoWordSet(current, all, 3);
    expect(set.length).toBeLessThanOrEqual(3);
    set.forEach(w => expect(all.map(a => a.wordId)).toContain(w.wordId));
  });

  it('does not add words already in the current set as replacements', () => {
    const current = [masteredWord('m1'), makeWord('u1'), makeWord('u2')];
    const all = [...current];
    const set = refreshAutoWordSet(current, all, 3);
    const ids = set.map(w => w.wordId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('returns correct count when enough replacement words are available', () => {
    const current = Array.from({ length: 5 }, (_, i) => masteredWord(`m${i}`));
    const extras = Array.from({ length: 10 }, (_, i) => makeWord(`new${i}`));
    const all = [...current, ...extras];
    const set = refreshAutoWordSet(current, all, 5);
    expect(set).toHaveLength(5);
  });

  it(`defaults to AUTO_WORD_SET_SIZE of ${AUTO_WORD_SET_SIZE}`, () => {
    const current = Array.from({ length: AUTO_WORD_SET_SIZE }, (_, i) => makeWord(`u${i}`));
    const all = [...current, ...Array.from({ length: 5 }, (_, i) => makeWord(`extra${i}`))];
    const set = refreshAutoWordSet(current, all);
    expect(set.length).toBeLessThanOrEqual(AUTO_WORD_SET_SIZE);
  });

  it('handles empty current set', () => {
    const all = Array.from({ length: 5 }, (_, i) => makeWord(`w${i}`));
    const set = refreshAutoWordSet([], all, 3);
    expect(set).toHaveLength(3);
  });

  it('streak reset: a word with a failure after passes is not mastered', () => {
    const word = failedWord('f1');
    expect(isWordMastered(word)).toBe(false);

    const current = [word];
    const all = [...current, makeWord('new1')];
    const set = refreshAutoWordSet(current, all, 2);
    const ids = set.map(w => w.wordId);
    expect(ids).toContain('f1');
  });

  it('handles mixed state: some mastered, some failed, some never tested', () => {
    const current = [masteredWord('m1'), failedWord('f1'), makeWord('u1')];
    const newWords = Array.from({ length: 5 }, (_, i) => makeWord(`new${i}`));
    const all = [...current, ...newWords];

    const set = refreshAutoWordSet(current, all, 5);
    expect(set).toHaveLength(5);
    const ids = set.map(w => w.wordId);
    expect(ids).not.toContain('m1');
    expect(ids).toContain('f1');
    expect(ids).toContain('u1');
  });

  it('samples from failed words using weighted selection when more failed words than needed', () => {
    // Ensures weightedSampleByRecency is exercised with count < words.length:
    // needed = 2, failedWords.length = 3 → weightedSampleByRecency([f1,f2,f3], 2)
    const current = [masteredWord('m1')];
    const failedWords = [failedWord('f1'), failedWord('f2'), failedWord('f3')];
    const all = [...current, ...failedWords];

    const set = refreshAutoWordSet(current, all, 2);
    expect(set).toHaveLength(2);
    const ids = set.map(w => w.wordId);
    expect(ids).not.toContain('m1');
    const failedInSet = ids.filter(id => ['f1', 'f2', 'f3'].includes(id));
    expect(failedInSet).toHaveLength(2);
  });

  it('weights recently failed words higher in weighted sampling', () => {
    const current = [masteredWord('m1')];
    const recentFail = makeWord('recent', [
      { created: now - 3000, pass: true },
      { created: now - 1000, pass: false }, // failed very recently
    ]);
    const oldFail = makeWord('old', [
      { created: now - 100 * DAY_MS, pass: true },
      { created: now - 99 * DAY_MS, pass: false }, // failed long ago
    ]);
    const extraFail = failedWord('extra');
    const all = [current[0], recentFail, oldFail, extraFail];

    // Run many times and check recently-failed word appears more often
    let recentCount = 0;
    for (let i = 0; i < 100; i++) {
      const set = refreshAutoWordSet(current, all, 2);
      if (set.some(w => w.wordId === 'recent')) recentCount++;
    }
    // Recent failure should appear in the majority of samples
    expect(recentCount).toBeGreaterThan(50);
  });
});

describe('constants', () => {
  it(`STREAK_THRESHOLD is ${STREAK_THRESHOLD}`, () => {
    expect(STREAK_THRESHOLD).toBe(3);
  });

  it(`COOLDOWN_DAYS is ${COOLDOWN_DAYS}`, () => {
    expect(COOLDOWN_DAYS).toBe(14);
  });

  it(`AUTO_WORD_SET_SIZE is ${AUTO_WORD_SET_SIZE}`, () => {
    expect(AUTO_WORD_SET_SIZE).toBe(10);
  });
});
