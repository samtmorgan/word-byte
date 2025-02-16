'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { speak } from '../../utils/speech';
import { Button, Review, ErrorPage, Loader } from '../../components';
import { getCurrentWords } from '../../actions/getCurrentWords';
import { Word } from '../../actions/getUser';

enum TestLifecycle {
  NOT_STARTED = 'notStarted',
  TEST = 'test',
  REVIEW = 'review',
  REVISE = 'revise',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="page-container">
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
    if (!currentWords) return;
    speak(currentWords[testIndex].word);
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
        <Button label="Start 🟢" onClick={() => setTestLifecycle(TestLifecycle.TEST)} />
      </Wrapper>
    );
  }

  if (testLifecycle === 'review') {
    return <Review currentWords={currentWords} />;
  }

  return (
    <Wrapper>
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
      <Button
        disabled={!hasSeenAllWords}
        label="Check Answers ✔"
        onClick={() => setTestLifecycle(TestLifecycle.REVIEW)}
      />
      <Button label="Cancel 🔴" onClick={() => setTestLifecycle(TestLifecycle.CANCELLED)} />
    </Wrapper>
  );
}
