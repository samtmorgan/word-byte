'use client';

import React, { useMemo, JSX } from 'react';
import dynamic from 'next/dynamic';
import { LocalResults } from '../types';
import styles from './Complete.module.css';

const Confetti = dynamic(() => import('../../confetti/Confetti'), { ssr: false });

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

const getResultsMessage = (correct: number, total: number): { title: string; message: string } => {
  const ratio = correct / total;

  if (ratio === 1) {
    return { title: 'Perfect score!', message: `You spelled all ${total} words correctly. Amazing work!` };
  }
  if (ratio >= 0.8) {
    return {
      title: 'Great effort!',
      message: `You got ${correct} out of ${total} right. Almost there!`,
    };
  }
  if (ratio >= 0.5) {
    return {
      title: 'Good going!',
      message: `You got ${correct} out of ${total} right. Keep practising and you'll get even more next time.`,
    };
  }
  if (correct > 0) {
    return {
      title: 'Nice try!',
      message: `You got ${correct} out of ${total} right. A bit more practice and these words will stick.`,
    };
  }
  return {
    title: 'Keep going!',
    message: `These are tricky words. Practising them a few times will make a big difference.`,
  };
};

export const Complete = ({ results }: { results: LocalResults }) => {
  const correct = useMemo(() => results.filter(({ pass }) => pass).length, [results]);
  const { title, message } = useMemo(() => getResultsMessage(correct, results.length), [correct, results.length]);
  const showWordsToPractice = useMemo(() => results.some(({ pass }) => !pass), [results]);

  return (
    <div>
      <h1 className={styles.completeTitle}>{title}</h1>
      <p className={styles.completeMessage}>{message}</p>
      {showWordsToPractice ? <WordsToPractice results={results} /> : <Confetti />}
    </div>
  );
};
