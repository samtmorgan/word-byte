'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Review, ErrorPage, Loader } from '../../components';
import { getCurrentWords } from '../../actions/getCurrentWords';
import { Word } from '../../actions/types';
import { sayTestWord } from '../../utils/sayTestWord';

enum TestLifecycle {
  NOT_STARTED = 'notStarted',
  TEST = 'test',
  REVIEW = 'review',
  REVISE = 'revise',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="pageContainer">
    <h1>Test time</h1>
    {children}
  </div>
);

export default function TestWordsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean | string>(false);
  const [currentWords, setCurrentWords] = useState<Word[] | null>(null);
  const [hasSeenAllWords, setHasSeenAllWords] = useState<boolean>(false);
  const [testIndex, setTestIndex] = useState<number>(0);
  const [testLifecycle, setTestLifecycle] = useState<TestLifecycle>(TestLifecycle.NOT_STARTED);

  useEffect(() => {
    const getTheWords = async () => {
      try {
        const words: Word[] | null = await getCurrentWords();
        setCurrentWords(words);
        setLoading(false);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };

    getTheWords();
  }, []);

  const sessionWordsCount = useMemo(() => currentWords?.length || 0, [currentWords]);

  const handleSpeak = useCallback(() => {
    sayTestWord(currentWords, testIndex);
  }, [currentWords, testIndex]);

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
  }, [testIndex, sessionWordsCount]);

  if (error)
    return (
      <Wrapper>
        <ErrorPage />
      </Wrapper>
    );

  if (loading || !currentWords)
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );

  if (currentWords.length === 0)
    return (
      <Wrapper>
        <h1>🙁 No words here yet</h1>
      </Wrapper>
    );

  if (testLifecycle === 'notStarted' || testLifecycle === 'finished' || testLifecycle === 'cancelled') {
    return (
      <Wrapper>
        <button type="button" onClick={() => setTestLifecycle(TestLifecycle.TEST)}>
          Start 🟢
        </button>
      </Wrapper>
    );
  }

  if (testLifecycle === 'review') {
    return <Review currentWords={currentWords} />;
  }

  return (
    <Wrapper>
      <span className="cool-border-with-shadow">{`${testIndex + 1} of ${sessionWordsCount} words`}</span>

      <button disabled={testIndex === sessionWordsCount} type="button" onClick={handleSpeak}>
        Say word 🔈
      </button>
      <div style={{ gap: '1rem' }}>
        <button disabled={testIndex === 0} onClick={() => handleIndexChange('decrement')} type="button">
          👈 Previous Word
        </button>
        <button
          disabled={testIndex + 1 === sessionWordsCount}
          onClick={() => handleIndexChange('increment')}
          type="button"
        >
          Next Word 👉
        </button>
      </div>
      <button disabled={!hasSeenAllWords} type="button" onClick={() => setTestLifecycle(TestLifecycle.REVIEW)}>
        Check Answers ✔
      </button>
      <button type="button" onClick={() => setTestLifecycle(TestLifecycle.CANCELLED)}>
        Cancel 🔴
      </button>
    </Wrapper>
  );
}
