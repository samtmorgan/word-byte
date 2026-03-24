import { Word, WordOwner, YearGroup } from '../actions/types';
import { buildDashboardStats, calculateGroupStats } from './dashboardStats';

const makeWord = (
  wordId: string,
  owner: WordOwner,
  yearGroup: YearGroup | undefined = undefined,
  results: { created: number; pass: boolean }[] = [],
): Word => ({ word: wordId, wordId, owner, results, yearGroup });

const now = Date.now();

const passResult = { created: now - 1000, pass: true };
const failResult = { created: now - 1000, pass: false };

describe('calculateGroupStats', () => {
  it('returns zeros for an empty word list', () => {
    expect(calculateGroupStats([])).toEqual({ label: '', total: 0, mastered: 0, accuracy: 0 });
  });

  it('counts total words correctly', () => {
    const words = [makeWord('w1', WordOwner.PLATFORM, 'year3_4'), makeWord('w2', WordOwner.PLATFORM, 'year3_4')];
    expect(calculateGroupStats(words).total).toBe(2);
  });

  it('counts mastered words (streak >= 3)', () => {
    const mastered = makeWord('w1', WordOwner.PLATFORM, undefined, [
      { created: now - 3000, pass: true },
      { created: now - 2000, pass: true },
      { created: now - 1000, pass: true },
    ]);
    const unmastered = makeWord('w2', WordOwner.PLATFORM, undefined, [{ created: now - 1000, pass: true }]);
    expect(calculateGroupStats([mastered, unmastered]).mastered).toBe(1);
  });

  it('returns 0 accuracy when no attempts have been made', () => {
    const words = [makeWord('w1', WordOwner.PLATFORM)];
    expect(calculateGroupStats(words).accuracy).toBe(0);
  });

  it('calculates accuracy as percentage of correct attempts', () => {
    const word = makeWord('w1', WordOwner.PLATFORM, undefined, [passResult, passResult, failResult]);
    expect(calculateGroupStats([word]).accuracy).toBe(67);
  });

  it('rounds accuracy to nearest integer', () => {
    const word = makeWord('w1', WordOwner.PLATFORM, undefined, [passResult, failResult]);
    expect(calculateGroupStats([word]).accuracy).toBe(50);
  });

  it('returns 100 accuracy when all attempts are correct', () => {
    const word = makeWord('w1', WordOwner.PLATFORM, undefined, [passResult, passResult]);
    expect(calculateGroupStats([word]).accuracy).toBe(100);
  });
});

describe('buildDashboardStats', () => {
  it('returns two groups (Y3/4 and Y5/6) when no custom words exist', () => {
    const words = [makeWord('y34', WordOwner.PLATFORM, 'year3_4'), makeWord('y56', WordOwner.PLATFORM, 'year5_6')];
    const groups = buildDashboardStats(words);
    expect(groups).toHaveLength(2);
    expect(groups[0].label).toBe('Y3/4');
    expect(groups[1].label).toBe('Y5/6');
  });

  it('includes a My Words group when custom words exist', () => {
    const words = [makeWord('y34', WordOwner.PLATFORM, 'year3_4'), makeWord('custom', WordOwner.USER)];
    const groups = buildDashboardStats(words);
    expect(groups).toHaveLength(3);
    expect(groups[2].label).toBe('My Words');
  });

  it('correctly counts words in each group', () => {
    const words = [
      makeWord('y34a', WordOwner.PLATFORM, 'year3_4'),
      makeWord('y34b', WordOwner.PLATFORM, 'year3_4'),
      makeWord('y56a', WordOwner.PLATFORM, 'year5_6'),
      makeWord('user1', WordOwner.USER),
      makeWord('user2', WordOwner.USER),
    ];
    const groups = buildDashboardStats(words);
    expect(groups[0].total).toBe(2);
    expect(groups[1].total).toBe(1);
    expect(groups[2].total).toBe(2);
  });

  it('handles an empty word list without throwing', () => {
    const groups = buildDashboardStats([]);
    expect(groups).toHaveLength(2);
    expect(groups[0]).toEqual({ label: 'Y3/4', total: 0, mastered: 0, accuracy: 0 });
    expect(groups[1]).toEqual({ label: 'Y5/6', total: 0, mastered: 0, accuracy: 0 });
  });

  it('computes mastery and accuracy stats per group independently', () => {
    const mastered = (id: string) =>
      makeWord(id, WordOwner.PLATFORM, 'year3_4', [
        { created: now - 3000, pass: true },
        { created: now - 2000, pass: true },
        { created: now - 1000, pass: true },
      ]);

    const words = [mastered('y34'), makeWord('y56', WordOwner.PLATFORM, 'year5_6', [failResult])];
    const groups = buildDashboardStats(words);
    expect(groups[0].mastered).toBe(1);
    expect(groups[0].accuracy).toBe(100);
    expect(groups[1].mastered).toBe(0);
    expect(groups[1].accuracy).toBe(0);
  });

  it('words without a yearGroup are excluded from KS2 groups', () => {
    const words = [
      makeWord('no-group', WordOwner.PLATFORM), // no yearGroup
      makeWord('y34', WordOwner.PLATFORM, 'year3_4'),
    ];
    const groups = buildDashboardStats(words);
    expect(groups[0].total).toBe(1); // only the tagged word
  });
});
