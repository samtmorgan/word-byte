import { Word } from '../actions/types';
import { LocalResults } from '../components/review/types';
import { getTimeStamp } from './getTimeStamp';

type mapResultsToUserWordsProps = {
  localResults: LocalResults;
  userWords: Word[];
};

export const mapResultsToUserWords = ({ localResults, userWords }: mapResultsToUserWordsProps): Word[] => {
  const updatedWords: Word[] = userWords.map(word => {
    const localResult = localResults.find(result => result.wordId === word.wordId);
    if (localResult) {
      const timestamp = getTimeStamp();
      const updatedWord: Word = { ...word };
      updatedWord.results.push({
        created: timestamp,
        pass: Boolean(localResult.pass),
      });

      return updatedWord;
    }
    return word;
  });
  return updatedWords;
};
