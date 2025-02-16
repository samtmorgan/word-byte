'use client';

import React, { useState, JSX } from 'react';
import { Word } from '../../actions/getUser';
import { Complete } from './components/Complete';
import { InProgress } from './components/InProgress';
import { LocalResults, ReviewButtonsProps, ReviewLifecycle, ReviewProps } from './types';

function buildLocalResults(currentWords: Word[]): LocalResults {
  return currentWords.map(word => ({ ...word, pass: null }));
}

const ReviewButtons = ({ reviewLifecycle, setReviewLifecycle }: ReviewButtonsProps): JSX.Element => (
  <div className="button-container">
    {reviewLifecycle === ReviewLifecycle.IN_PROGRESS ? (
      <button
        className="button cool-border-with-shadow finish-button"
        type="button"
        onClick={() => setReviewLifecycle(ReviewLifecycle.COMPLETE)}
      >
        🏁 Finish
      </button>
    ) : (
      <a className="button cool-border-with-shadow finish-button" href="/">
        🏠 Go to home
      </a>
    )}
  </div>
);

export default function Review({ currentWords }: ReviewProps) {
  const [results, setResults] = useState<LocalResults>(buildLocalResults(currentWords || []));
  const [reviewLifecycle, setReviewLifecycle] = useState<ReviewLifecycle>(ReviewLifecycle.IN_PROGRESS);

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
