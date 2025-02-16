import React, { useMemo, JSX } from 'react';
import Confetti from '../../confetti/Confetti';
import { LocalResults } from '../types';

const WordsToPractice = ({ results }: { results: LocalResults }): JSX.Element => (
  <div className="words-to-practice-container">
    <h1>Want to practice?</h1>
    <p>Write these words out a few times</p>
    <ol>
      {results
        .filter(({ pass }) => !pass)
        .map(({ word }) => (
          <li key={word}>{word}</li>
        ))}
    </ol>
  </div>
);

export const Complete = ({ results }: { results: LocalResults }) => {
  const showWordsToPractice = useMemo(() => results.some(({ pass }) => !pass), [results]);

  return (
    <div className="complete-container">
      <h1>You did it!</h1>
      <p>
        You got {results.filter(({ pass }) => pass).length} out of {results.length} words right.
      </p>
      {showWordsToPractice ? <WordsToPractice results={results} /> : <Confetti />}
    </div>
  );
};
