'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Fireworks from './Fireworks';
import { ResultType } from '../types/types';
import Loader from './Loader';

function buildResults(words: string[]): ResultType[] {
  return words.map(word => ({ word, correct: false }));
}

export default function Review() {
  const { user, loading, error } = useAppContext();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [results, setResults] = useState<ResultType[]>(
    user?.words.wordSets[0] ? buildResults(user.words.wordSets[0]) : [],
  );

  const handleWordClick = useCallback(
    (index: number) => {
      const newResults = [...results];
      newResults[index].correct = !newResults[index].correct;
      setResults(newResults);
    },
    [results],
  );
  useEffect(() => {
    if (results?.every(({ correct }) => correct)) {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 10000);
    }
  }, [results]);

  if (error) return <div>Error...</div>;

  if (loading) return <Loader />;

  if (!results || results.length === 0) return <div>🙁 No words here yet</div>;

  return (
    <>
      <div className="page-container">
        <section className="review">
          <h1>Click the words you got right ✓</h1>

          <ol>
            {results.map((result, index) => (
              <li className="word-list" key={result.word}>
                <button
                  className={`button cool-border-with-shadow ${result.correct && 'correct-word'}`}
                  type="button"
                  onClick={() => handleWordClick(index)}
                  key={result.word}
                >
                  {`${result.word} ${result.correct ? '✓' : ''}`}
                </button>
              </li>
            ))}
          </ol>

          {/* <h2>Click the words you got right ✓</h2>
          {results.map((wordData, index) => (
            <button
              className={`button cool-border-with-shadow ${wordData.correct && 'correct-word'}`}
              type="button"
              onClick={() => handleWordClick(index)}
              key={wordData.word}
            >
              {`${wordData.word} ${wordData.correct ? '✓' : ''}`}
            </button>
          ))} */}
        </section>
      </div>
      {/* {isVisible && <Confetti />} */}
      {isVisible && <Fireworks />}
    </>
  );
}
