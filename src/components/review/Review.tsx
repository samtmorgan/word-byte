'use client';

import React, { useState, JSX, useCallback, useEffect } from 'react';
import { Word } from '../../actions/types';
import { Complete } from './components/Complete';
import { InProgress } from './components/InProgress';
import { LocalResults, ReviewButtonsProps, ReviewLifecycle, ReviewProps } from './types';
import { addTestResults } from '../../actions/addTestResults';

function buildLocalResults(currentWords: Word[]): LocalResults {
  return currentWords.map(({ word, wordId }) => ({ word, wordId, pass: null }));
}

const ReviewButtons = ({ reviewLifecycle, setReviewLifecycle }: ReviewButtonsProps): JSX.Element => {
  const handleFinish = useCallback(async () => {
    setReviewLifecycle(ReviewLifecycle.COMPLETE);
  }, [setReviewLifecycle]);

  return (
    <div className="button-container">
      {reviewLifecycle === ReviewLifecycle.IN_PROGRESS ? (
        <button className="button cool-border-with-shadow finish-button" type="button" onClick={handleFinish}>
          🏁 Finish
        </button>
      ) : (
        <a className="button cool-border-with-shadow finish-button" href="/">
          🏠 Go to home
        </a>
      )}
    </div>
  );
};

export default function Review({ currentWords }: ReviewProps) {
  const [results, setResults] = useState<LocalResults>(buildLocalResults(currentWords || []));
  const [reviewLifecycle, setReviewLifecycle] = useState<ReviewLifecycle>(ReviewLifecycle.IN_PROGRESS);

  useEffect(() => {
    if (reviewLifecycle === ReviewLifecycle.COMPLETE) {
      addTestResults(results);
    }
  }, [reviewLifecycle, results]);

  if (!results || results.length === 0) return <div>🙁 No words here yet</div>;

  return (
    <div className="page-container">
      <section className="review">
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
