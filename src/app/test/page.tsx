'use client';

import LinkButton from '@/components/LinkButton';
import { useAppContext } from '@/context/AppContext';
import { speak } from '@/utils/wordUtils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

export default function TestWordsPage() {
  const { sessionWords, loading } = useAppContext();
  const [hasSeenAllWords, setHasSeenAllWords] = useState<boolean>(false);
  const [testIndex, setTestIndex] = useState<number>(0);

  //   const currentWords = useMemo(() => {
  //     if (!user) return [];
  //     return user?.words?.filter(({ current }) => current) || [];
  //   }, [user]);
  const sessionWordsCount = useMemo(() => {
    if (!sessionWords) return 0;
    return sessionWords.length;
  }, [sessionWords]);

  const handleSpeak = useCallback(() => {
    if (!sessionWords) return;
    speak(sessionWords[testIndex].word);
  }, [sessionWords, testIndex]);

  const handleIndexChange = useCallback(
    (direction: 'increment' | 'decrement') => {
      if (direction === 'increment') {
        setTestIndex(testIndex + 1);
      }
      if (direction === 'decrement') {
        setTestIndex(testIndex - 1);
      }
    },
    [testIndex],
  );

  //   useEffect(() => {
  //     const words = [
  //       'automatic',
  //       'automatically',
  //       'automobile',
  //       'autograph',
  //       'autocue',
  //       'autopilot',
  //       'autobiography',
  //       'autobiographies',
  //     ].map(word => generateWordObject(word, 'user'));

  //     console.log(words);
  //   }, []);

  useEffect(() => {
    if (testIndex + 1 === sessionWordsCount) {
      setHasSeenAllWords(true);
    }
  }, [setHasSeenAllWords, testIndex, sessionWordsCount]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="test-page-container">
      <span className="cool-border-with-shadow">{`${testIndex + 1} of ${sessionWordsCount} words`}</span>
      <button
        disabled={testIndex === sessionWordsCount}
        type="button"
        className="button cool-border-with-shadow"
        onClick={handleSpeak}
      >
        Say word 🔈
      </button>
      <div style={{ gap: '1rem' }}>
        <button
          disabled={testIndex === 0}
          type="button"
          className="button cool-border-with-shadow"
          onClick={() => handleIndexChange('decrement')}
        >
          👈 Previous Word
        </button>
        <button
          disabled={testIndex + 1 === sessionWordsCount}
          type="button"
          className="button cool-border-with-shadow"
          onClick={() => handleIndexChange('increment')}
        >
          Next Word 👉
        </button>
      </div>
      {/* <button
        disabled={!hasSeenAllWords}
        type="button"
        className="button cool-border-with-shadow"
        onClick={() => setTestIndex(testIndex + 1)}
      >
        Check Answers ✔
      </button> */}
      <LinkButton disabled={!hasSeenAllWords} label="Check Answers ✔" href="/check" />
      {/* <div className="grid grid-cols-8 gap-4">
        {year3AndYear4StandardWords.map(word => (
          <div key={word}>
            <div className="rounded bg-orange-500 p-1.5 text-white">
              <p>{word}</p>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}
