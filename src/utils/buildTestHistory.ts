import { Word } from '../actions/types';

export interface TestSession {
  timestamp: number;
  words: { word: string; wordId: string; pass: boolean }[];
  score: number;
  total: number;
}

const SESSION_GAP_MS = 5000;

export function buildTestHistory(words: Word[]): TestSession[] {
  const flat = words.flatMap(w =>
    w.results.map(r => ({
      wordId: w.wordId,
      word: w.word,
      created: r.created,
      pass: r.pass,
    })),
  );

  flat.sort((a, b) => a.created - b.created);

  const sessions: TestSession[] = [];
  let i = 0;

  while (i < flat.length) {
    const group: typeof flat = [flat[i]];
    let j = i + 1;
    while (j < flat.length && flat[j].created - flat[j - 1].created < SESSION_GAP_MS) {
      group.push(flat[j]);
      j++;
    }

    const sessionWords = group.map(r => ({ word: r.word, wordId: r.wordId, pass: r.pass }));
    const score = sessionWords.filter(w => w.pass).length;
    sessions.push({
      timestamp: group[0].created,
      words: sessionWords,
      score,
      total: sessionWords.length,
    });

    i = j;
  }

  sessions.sort((a, b) => b.timestamp - a.timestamp);

  return sessions;
}
