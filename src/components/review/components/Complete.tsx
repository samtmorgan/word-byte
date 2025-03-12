import React, { useMemo, JSX } from 'react';
import Confetti from '../../confetti/Confetti';
import { LocalResults } from '../types';
import styles from './Complete.module.css';

const WordsToPractice = ({ results }: { results: LocalResults }): JSX.Element => (
  <div>
    <h2 className={styles.practiceTitle}>Want to practice?</h2>
    <p className={styles.practiceMessage}>Write these words out a few times</p>
    <ol className={styles.wordList}>
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
    <div>
      <h1 className={styles.completeTitle}>You did it!</h1>
      <p className={styles.completeMessage}>
        You got {results.filter(({ pass }) => pass).length} out of {results.length} words right.
      </p>
      {showWordsToPractice ? <WordsToPractice results={results} /> : <Confetti />}
    </div>
  );
};
