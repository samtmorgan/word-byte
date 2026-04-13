'use client';

import React, { useState, JSX, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Word } from '../../actions/types';
import { Complete } from './components/Complete';
import { InProgress } from './components/InProgress';
import { LocalResults, ReviewButtonsProps, ReviewLifecycle, ReviewProps } from './types';
import { addTestResults } from '../../actions/addTestResults';
import { PATHS } from '../../constants';
import styles from './Review.module.css';

function buildLocalResults(currentWords: Word[]): LocalResults {
  return currentWords.map(({ word, wordId }) => ({ word, wordId, pass: null }));
}

const ReviewButtons = ({ reviewLifecycle, setReviewLifecycle }: ReviewButtonsProps): JSX.Element => {
  const handleFinish = useCallback(async () => {
    setReviewLifecycle(ReviewLifecycle.COMPLETE);
  }, [setReviewLifecycle]);

  return (
    <div className={styles.buttonContainer}>
      {reviewLifecycle === ReviewLifecycle.IN_PROGRESS ? (
        <button className={styles.finishButton} type="button" onClick={handleFinish}>
          🏁 Finish
        </button>
      ) : (
        <Link className={styles.finishButton} href={PATHS.ROOT}>
          Done
        </Link>
      )}
    </div>
  );
};

export default function Review({ currentWords, isAutoMode = false }: ReviewProps) {
  const [results, setResults] = useState<LocalResults>(buildLocalResults(currentWords || []));
  const [reviewLifecycle, setReviewLifecycle] = useState<ReviewLifecycle>(ReviewLifecycle.IN_PROGRESS);

  useEffect(() => {
    if (reviewLifecycle === ReviewLifecycle.COMPLETE) {
      addTestResults({ localResults: results, isAutoMode }).then(result => {
        if (!result.success) {
          console.error('Failed to save test results:', result.code, result.error);
        }
      });
    }
  }, [reviewLifecycle, results, isAutoMode]);

  if (!results || results.length === 0) return <div>🙁 No words here yet</div>;

  return (
    <div className="pageContainer">
      <section className={styles.review}>
        {reviewLifecycle === ReviewLifecycle.IN_PROGRESS ? (
          <InProgress results={results} setResults={setResults} />
        ) : (
          <Complete results={results} />
        )}
        <ReviewButtons reviewLifecycle={reviewLifecycle} setReviewLifecycle={setReviewLifecycle} />
      </section>
    </div>
  );
}
