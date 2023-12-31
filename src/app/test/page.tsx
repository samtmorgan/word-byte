'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { speak } from '../../utils/wordUtils';
import { Button } from '../../components/Button';
import Review from '../../components/Review';
import Loader from '../../components/Loader';
import { TestLifecycleType } from '../../types/types';

export default function TestWordsPage() {
  const { user, loading, setLoading, error } = useAppContext();
  const [hasSeenAllWords, setHasSeenAllWords] = useState<boolean>(false);
  const [testIndex, setTestIndex] = useState<number>(0);
  const [sessionWords, setSessionWords] = useState<string[] | null>(null);
  const [testLifecycle, setTestLifecycle] = useState<TestLifecycleType | null>('notStarted');

  useEffect(() => {
    if (user) {
      setSessionWords(user.words.wordSets[0]);
    }
  }, [setSessionWords, user, setLoading]);

  const sessionWordsCount = useMemo(() => {
    if (!sessionWords) return 0;
    return sessionWords.length;
  }, [sessionWords]);

  //   useEffect(() => {
  //     console.log({ sessionWords, user });
  //   }, [sessionWords, user]);

  const handleSpeak = useCallback(() => {
    if (!sessionWords) return;
    speak(sessionWords[testIndex]);
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

  useEffect(() => {
    if (testIndex + 1 === sessionWordsCount) {
      setHasSeenAllWords(true);
    }
  }, [setHasSeenAllWords, testIndex, sessionWordsCount]);

  if (error) return <div>Error...</div>;

  if (loading || !sessionWords) return <Loader />;

  if (sessionWords.length === 0) return <div>🙁 No words here yet</div>;

  if (testLifecycle === 'notStarted' || testLifecycle === 'finished' || testLifecycle === 'cancelled') {
    return (
      <div className="page-container">
        <Button label="Start 🟢" onClick={() => setTestLifecycle('test')} />
      </div>
    );
  }

  if (testLifecycle === 'review') {
    return <Review />;
  }

  return (
    <div className="page-container">
      <span className="cool-border-with-shadow">{`${testIndex + 1} of ${sessionWordsCount} words`}</span>

      <Button disabled={testIndex === sessionWordsCount} label="Say word 🔈" onClick={handleSpeak} />
      <div style={{ gap: '1rem' }}>
        <Button disabled={testIndex === 0} onClick={() => handleIndexChange('decrement')} label="👈 Previous Word" />
        <Button
          disabled={testIndex + 1 === sessionWordsCount}
          onClick={() => handleIndexChange('increment')}
          label="Next Word 👉"
        />
      </div>
      <Button disabled={!hasSeenAllWords} label="Check Answers ✔" onClick={() => setTestLifecycle('review')} />
      <Button label="Cancel 🔴" onClick={() => setTestLifecycle('cancelled')} />
    </div>
  );
}
