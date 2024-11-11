'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { speak } from '../../utils/wordUtils';
import { Button } from '../../components/Button';
import Review from '../../components/Review';
import Loader from '../../components/Loader';
import { TestLifecycleType } from '../../types/types';

export default function TestWordsPage() {
  const { testWords, loading, error } = useAppContext();
  const [hasSeenAllWords, setHasSeenAllWords] = useState<boolean>(false);
  const [testIndex, setTestIndex] = useState<number>(0);
  const [testLifecycle, setTestLifecycle] = useState<TestLifecycleType | null>('notStarted');

  const sessionWordsCount = useMemo(() => {
    if (!testWords) return 0;
    return testWords.length;
  }, [testWords]);

  const handleSpeak = useCallback(() => {
    if (!testWords) return;
    speak(testWords[testIndex]);
  }, [testWords, testIndex]);

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

  useEffect(() => {
    if (testIndex + 1 === sessionWordsCount) {
      setHasSeenAllWords(true);
    }
  }, [setHasSeenAllWords, testIndex, sessionWordsCount]);

  return (
    <>
      <h1>Test time</h1>

      {error && <div>Error...</div>}

      {(loading || !testWords) && <Loader />}

      {testWords.length === 0 && <div>🙁 No words here yet</div>}

      {(testLifecycle === 'notStarted' || testLifecycle === 'finished' || testLifecycle === 'cancelled') && (
        <div className="page-container">
          <Button label="Start 🟢" onClick={() => setTestLifecycle('test')} />
        </div>
      )}

      {testLifecycle === 'review' && <Review />}

      {testLifecycle === 'test' && (
        <div className="page-container">
          <span className="cool-border-with-shadow">{`${testIndex + 1} of ${sessionWordsCount} words`}</span>

          <Button disabled={testIndex === sessionWordsCount} label="Say word 🔈" onClick={handleSpeak} />
          <div style={{ gap: '1rem' }}>
            <Button
              disabled={testIndex === 0}
              onClick={() => handleIndexChange('decrement')}
              label="👈 Previous Word"
            />
            <Button
              disabled={testIndex + 1 === sessionWordsCount}
              onClick={() => handleIndexChange('increment')}
              label="Next Word 👉"
            />
          </div>
          <Button disabled={!hasSeenAllWords} label="Check Answers ✔" onClick={() => setTestLifecycle('review')} />
          <Button label="Cancel 🔴" onClick={() => setTestLifecycle('cancelled')} />
        </div>
      )}
    </>
  );
}
