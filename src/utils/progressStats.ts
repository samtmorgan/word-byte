import { Word } from '../actions/types';

export interface WordProgress {
  attempts: number;
  passes: number;
  fails: number;
  successRate: number | null;
  recentStreak: boolean[];
}

export function getWordProgress(word: Word): WordProgress {
  const attempts = word.results.length;
  const passes = word.results.filter(r => r.pass).length;
  const fails = attempts - passes;
  const successRate = attempts === 0 ? null : Math.round((passes / attempts) * 100);
  const recentStreak = [...word.results]
    .sort((a, b) => b.created - a.created)
    .slice(0, 3)
    .map(r => r.pass);

  return { attempts, passes, fails, successRate, recentStreak };
}
