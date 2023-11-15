'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Fireworks from './Fireworks';
import { ResultType } from '../types/types';

export default function Review() {
  const { sessionWords, loading } = useAppContext();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [results, setResults] = useState<ResultType[]>(sessionWords?.map(word => ({ word, correct: false })) || []);

  const handleWordClick = useCallback(
    (index: number) => {
      if (!sessionWords) return;
      const newResults = [...results];
      newResults[index].correct = !newResults[index].correct;
      setResults(newResults);
    },
    [results, sessionWords],
  );
  useEffect(() => {
    if (results?.every(({ correct }) => correct)) {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 10000);
    }
  }, [results]);

  if (loading) return <div>Loading...</div>;

  if (!sessionWords) return <div>No words</div>;

  return (
    <>
      <div className="page-container">
        <section className="review">
          <h2>Click the words you got right ✓</h2>
          {results.map((wordData, index) => (
            <button
              className={`button cool-border-with-shadow ${wordData.correct && 'correct-word'}`}
              type="button"
              onClick={() => handleWordClick(index)}
              key={wordData.word}
            >
              {`${wordData.word} ${wordData.correct ? '✓' : ''}`}
            </button>
          ))}
        </section>
      </div>
      {/* {isVisible && <Confetti />} */}
      {isVisible && <Fireworks />}
    </>
  );
}
