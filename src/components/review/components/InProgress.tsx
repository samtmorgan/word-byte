import React, { useCallback } from 'react';
import { LocalResults } from '../types';

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
      <p>Click the words you got right ✓</p>
      <ol>
        {results.map((result, index) => (
          <li className="word-list" key={result.wordId}>
            <button
              className={`button cool-border-with-shadow ${result.pass ? 'correct-word' : ''}`}
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
