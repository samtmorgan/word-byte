import { Word, WordSet } from '../actions/types';

export const buildWordSetData = (wordSets: WordSet[], words: Word[], index: number): Word[] => {
  const wordSetData: Word[] = wordSets[index]?.wordIds
    .map(wordId => words.find(word => word.wordId === wordId))
    .filter(word => word !== undefined);

  return wordSetData;
};
