'use client';

import { useAppContext } from '@/context/AppContext';
// import { speak } from '@/utils/wordUtils';
import React, { useCallback } from 'react';

export default function CheckWordsPage() {
  const { sessionWords, setSessionWords, loading } = useAppContext();
  //   const [hasSeenAllWords, setHasSeenAllWords] = useState<boolean>(false);
  //   const [testIndex, setTestIndex] = useState<number>(0);

  //   const handleIndexChange = useCallback(
  //     (direction: 'increment' | 'decrement') => {
  //       if (direction === 'increment') {
  //         setTestIndex(testIndex + 1);
  //       }
  //       if (direction === 'decrement') {
  //         setTestIndex(testIndex - 1);
  //       }
  //     },
  //     [testIndex],
  //   );

  const handleWordClick = useCallback(
    (index: number) => {
      if (!sessionWords) return;
      const newSessionWords = [...sessionWords];
      newSessionWords[index].correct = !newSessionWords[index].correct;
      setSessionWords(newSessionWords);
    },
    [sessionWords, setSessionWords],
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="test-page-container">
      {sessionWords &&
        (sessionWords.length > 0 ? (
          sessionWords.map((wordData, index) => (
            <button
              className={`button cool-border-with-shadow ${wordData.correct && 'correct-word'}`}
              type="button"
              onClick={() => handleWordClick(index)}
              key={wordData.word}
            >
              {`${wordData.word} ${wordData.correct ? '✓' : '？'}`}
            </button>
            // <div key={wordData.word}>
            //   <input type="checkbox" id={wordData.word} name="scales" checked />
            //   <label htmlFor={wordData.word}>{wordData.word}</label>
            // </div>
            // <div key={wordData.word}>
            //   <span>{wordData.word}</span>
            // </div>
          ))
        ) : (
          <div>
            <span>No words</span>
          </div>
        ))}
    </div>
  );
}
