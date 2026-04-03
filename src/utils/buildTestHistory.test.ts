import { Word, WordOwner } from '../actions/types';
import { buildTestHistory } from './buildTestHistory';

const makeWord = (
  id: string,
  word: string,
  results: { created: number; pass: boolean }[],
  owner = WordOwner.PLATFORM,
): Word => ({
  word,
  wordId: id,
  owner,
  results,
});

const now = 1700000000000;

describe('buildTestHistory', () => {
  it('returns empty array when no words provided', () => {
    expect(buildTestHistory([])).toEqual([]);
  });

  it('returns empty array when words have no results', () => {
    expect(buildTestHistory([makeWord('w1', 'apple', [])])).toEqual([]);
  });

  it('groups results within 5 seconds into a single session', () => {
    const words = [
      makeWord('w1', 'apple', [{ created: now, pass: true }]),
      makeWord('w2', 'banana', [{ created: now + 1000, pass: false }]),
      makeWord('w3', 'cherry', [{ created: now + 2000, pass: true }]),
    ];
    const sessions = buildTestHistory(words);
    expect(sessions).toHaveLength(1);
    expect(sessions[0].total).toBe(3);
    expect(sessions[0].score).toBe(2);
    expect(sessions[0].timestamp).toBe(now);
  });

  it('splits results more than 5 seconds apart into separate sessions', () => {
    const words = [
      makeWord('w1', 'apple', [
        { created: now, pass: true },
        { created: now + 10000, pass: false },
      ]),
    ];
    const sessions = buildTestHistory(words);
    expect(sessions).toHaveLength(2);
  });

  it('returns sessions sorted by timestamp descending (most recent first)', () => {
    const words = [
      makeWord('w1', 'apple', [
        { created: now, pass: true },
        { created: now + 10000, pass: false },
      ]),
    ];
    const sessions = buildTestHistory(words);
    expect(sessions[0].timestamp).toBeGreaterThan(sessions[1].timestamp);
  });

  it('handles a single result as a single session', () => {
    const words = [makeWord('w1', 'apple', [{ created: now, pass: true }])];
    const sessions = buildTestHistory(words);
    expect(sessions).toHaveLength(1);
    expect(sessions[0].score).toBe(1);
    expect(sessions[0].total).toBe(1);
    expect(sessions[0].words[0]).toEqual({ word: 'apple', wordId: 'w1', pass: true });
  });

  it('handles multiple sessions on the same day', () => {
    const morning = now;
    const afternoon = now + 4 * 60 * 60 * 1000;
    const words = [
      makeWord('w1', 'apple', [
        { created: morning, pass: true },
        { created: afternoon, pass: false },
      ]),
    ];
    const sessions = buildTestHistory(words);
    expect(sessions).toHaveLength(2);
  });

  it('correctly computes score for a session with all passes', () => {
    const words = [
      makeWord('w1', 'apple', [{ created: now, pass: true }]),
      makeWord('w2', 'banana', [{ created: now + 500, pass: true }]),
    ];
    const sessions = buildTestHistory(words);
    expect(sessions[0].score).toBe(2);
    expect(sessions[0].total).toBe(2);
  });

  it('correctly computes score for a session with all fails', () => {
    const words = [
      makeWord('w1', 'apple', [{ created: now, pass: false }]),
      makeWord('w2', 'banana', [{ created: now + 500, pass: false }]),
    ];
    const sessions = buildTestHistory(words);
    expect(sessions[0].score).toBe(0);
    expect(sessions[0].total).toBe(2);
  });

  it('sets wordListType to "auto" when all words are platform-owned', () => {
    const words = [
      makeWord('w1', 'apple', [{ created: now, pass: true }]),
      makeWord('w2', 'banana', [{ created: now + 500, pass: false }]),
    ];
    const sessions = buildTestHistory(words);
    expect(sessions[0].wordListType).toBe('auto');
  });

  it('sets wordListType to "custom" when any word is user-owned', () => {
    const words = [
      makeWord('w1', 'apple', [{ created: now, pass: true }]),
      makeWord('w2', 'banana', [{ created: now + 500, pass: false }], WordOwner.USER),
    ];
    const sessions = buildTestHistory(words);
    expect(sessions[0].wordListType).toBe('custom');
  });
});
