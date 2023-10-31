'use client';

import { useAppContext } from '@/context/AppContext';
// import { speak } from '@/utils/wordUtils';
import React from 'react';

export default function CheckWordsPage() {
  const { sessionWords, loading } = useAppContext();
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="test-page-container">
      {sessionWords &&
        (sessionWords.length > 0 ? (
          sessionWords.map(wordData => (
            <div key={wordData.word}>
              <input type="checkbox" id={wordData.word} name="scales" checked />
              <label htmlFor={wordData.word}>{wordData.word}</label>
            </div>
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
