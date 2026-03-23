import { Word, Result } from '../actions/types';

export const STREAK_THRESHOLD = 3;
export const COOLDOWN_DAYS = 14;
export const AUTO_WORD_SET_SIZE = 10;

export const calculateStreak = (results: Result[]): number => {
  if (!results.length) return 0;

  const sorted = [...results].sort((a, b) => b.created - a.created);

  let streak = 0;
  for (const result of sorted) {
    if (result.pass) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

export const isWordMastered = (word: Word): boolean => {
  return calculateStreak(word.results) >= STREAK_THRESHOLD;
};

export const isDueForResurface = (word: Word, cooldownDays: number = COOLDOWN_DAYS): boolean => {
  if (!isWordMastered(word)) return false;
  if (!word.results.length) return false;

  const lastTested = Math.max(...word.results.map(r => r.created));
  const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
  return Date.now() - lastTested > cooldownMs;
};

export const initAutoWordSet = (allWords: Word[], count: number = AUTO_WORD_SET_SIZE): Word[] => {
  const unmastered = allWords.filter(w => !isWordMastered(w));

  if (unmastered.length >= count) {
    return shuffleArray(unmastered).slice(0, count);
  }

  const dueForResurface = allWords.filter(w => isDueForResurface(w));
  const unmasteredIds = new Set(unmastered.map(w => w.wordId));
  const pool = [...unmastered, ...dueForResurface.filter(w => !unmasteredIds.has(w.wordId))];

  if (pool.length >= count) {
    return shuffleArray(pool).slice(0, count);
  }

  return shuffleArray(allWords).slice(0, count);
};

export const refreshAutoWordSet = (currentSet: Word[], allWords: Word[], count: number = AUTO_WORD_SET_SIZE): Word[] => {
  const retained = currentSet.filter(w => !isWordMastered(w));
  const needed = count - retained.length;

  if (needed <= 0) return retained.slice(0, count);

  const currentIds = new Set(currentSet.map(w => w.wordId));
  const available = allWords.filter(w => !currentIds.has(w.wordId));

  const neverTested = available.filter(w => w.results.length === 0);
  const failedWords = available.filter(w => w.results.length > 0 && !isWordMastered(w));
  const resurfaceWords = available.filter(w => isDueForResurface(w));

  const replacements: Word[] = [];

  const fromPool1 = shuffleArray(neverTested);
  replacements.push(...fromPool1.slice(0, needed));

  if (replacements.length < needed) {
    const remaining = needed - replacements.length;
    const fromPool2 = weightedSampleByRecency(failedWords, remaining);
    replacements.push(...fromPool2);
  }

  if (replacements.length < needed) {
    const remaining = needed - replacements.length;
    const fromPool3 = shuffleArray(resurfaceWords);
    replacements.push(...fromPool3.slice(0, remaining));
  }

  return [...retained, ...replacements];
};

const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const weightedSampleByRecency = (words: Word[], count: number): Word[] => {
  if (words.length === 0) return [];
  if (count >= words.length) return shuffleArray(words);

  const now = Date.now();

  const weighted = words.map(word => {
    const lastFailed = word.results
      .filter(r => !r.pass)
      .reduce((max, r) => Math.max(max, r.created), 0);
    const weight = lastFailed > 0 ? 1 / (now - lastFailed + 1) : 1;
    return { word, weight };
  });

  const result: Word[] = [];
  const remaining = [...weighted];

  for (let i = 0; i < count && remaining.length > 0; i++) {
    const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
    let r = Math.random() * totalWeight;
    let selected = remaining.length - 1;
    for (let j = 0; j < remaining.length; j++) {
      r -= remaining[j].weight;
      if (r <= 0) {
        selected = j;
        break;
      }
    }
    result.push(remaining[selected].word);
    remaining.splice(selected, 1);
  }

  return result;
};
