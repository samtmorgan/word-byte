'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Fireworks from './Fireworks';
// import { speak } from '@/utils/wordUtils';

export default function Review() {
  const { sessionWords, setSessionWords, loading } = useAppContext();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleWordClick = useCallback(
    (index: number) => {
      if (!sessionWords) return;
      const newSessionWords = [...sessionWords];
      newSessionWords[index].correct = !newSessionWords[index].correct;
      setSessionWords(newSessionWords);
    },
    [sessionWords, setSessionWords],
  );
  useEffect(() => {
    if (sessionWords?.every(({ correct }) => correct)) {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 10000);
    }
  }, [sessionWords]);

  if (loading) return <div>Loading...</div>;

  if (!sessionWords) return <div>No words</div>;

  return (
    <>
      <div className="test-page-container">
        <h2>Click the words you got right ✓</h2>
        {sessionWords.map((wordData, index) => (
          <button
            className={`button cool-border-with-shadow ${wordData.correct && 'correct-word'}`}
            type="button"
            onClick={() => handleWordClick(index)}
            key={wordData.word}
          >
            {`${wordData.word} ${wordData.correct ? '✓' : ''}`}
          </button>
          // <div key={wordData.word}>
          //   <input type="checkbox" id={wordData.word} name="scales" checked />
          //   <label htmlFor={wordData.word}>{wordData.word}</label>
          // </div>
          // <div key={wordData.word}>
          //   <span>{wordData.word}</span>
          // </div>
        ))}
      </div>
      {/* {isVisible && <Confetti />} */}
      {isVisible && <Fireworks />}
    </>
  );
}
