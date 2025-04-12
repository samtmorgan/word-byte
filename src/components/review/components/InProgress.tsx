import React, { useCallback } from 'react';
import { LocalResults } from '../types';
import styles from './InProgress.module.css';

type InProgressProps = {
  setResults: React.Dispatch<React.SetStateAction<LocalResults>>;
  results: LocalResults;
};

export const InProgress = ({ setResults, results }: InProgressProps) => {
  const handleWordClick = useCallback(
    (index: number) => {
      const newResults = [...results];
      newResults[index].pass = !newResults[index].pass;
      setResults(newResults);
    },
    [results, setResults],
  );

  return (
    <>
      <h1>Time to check your spellings!</h1>
      <p className={styles.instruction}>Click the words you got right ✓</p>
      <ol className={styles.wordList}>
        {results.map((result, index) => (
          <li key={result.wordId}>
            <button
              className={`${result.pass ? 'correct-word' : ''}`}
              type="button"
              onClick={() => handleWordClick(index)}
              key={result.word}
            >
              {`${result.word} ${result.pass ? '✓' : ''}`}
            </button>
          </li>
        ))}
      </ol>
    </>
  );
};
