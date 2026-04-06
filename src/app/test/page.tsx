'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Review, ErrorPage, Loader } from '../../components';
import { Modal } from '../../components/modal/Modal';
import { getCurrentWords } from '../../actions/getCurrentWords';
import { getAutoWords } from '../../actions/getAutoWords';
import { Word } from '../../actions/types';
import { sayTestWord } from '../../utils/sayTestWord';

enum TestLifecycle {
  NOT_STARTED = 'notStarted',
  TEST = 'test',
  REVIEW = 'review',
  REVISE = 'revise',
  FINISHED = 'finished',
}

const Wrapper = ({ children }: { children: React.ReactNode }) => <div className="pageContainer">{children}</div>;

function TestWordsPageContent() {
  const searchParams = useSearchParams();
  const isAutoMode = searchParams.get('mode') === 'auto';

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean | string>(false);
  const [currentWords, setCurrentWords] = useState<Word[] | null>(null);
  const [isEmptyAutoSet, setIsEmptyAutoSet] = useState<boolean>(false);
  const [hasSeenAllWords, setHasSeenAllWords] = useState<boolean>(false);
  const [testIndex, setTestIndex] = useState<number>(0);
  const [testLifecycle, setTestLifecycle] = useState<TestLifecycle>(TestLifecycle.NOT_STARTED);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const loadWords = async () => {
      try {
        if (isAutoMode) {
          const result = await getAutoWords();
          if (result.isEmpty) {
            setIsEmptyAutoSet(true);
            setCurrentWords([]);
          } else {
            setCurrentWords(result.words);
          }
        } else {
          const words: Word[] | null = await getCurrentWords();
          setCurrentWords(words);
        }
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };

    loadWords();
  }, [isAutoMode]);

  const sessionWordsCount = useMemo(() => currentWords?.length || 0, [currentWords]);

  const handleSpeak = useCallback(async () => {
    setIsSpeaking(true);
    try {
      await sayTestWord(currentWords, testIndex);
    } finally {
      setIsSpeaking(false);
    }
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

  useEffect(() => {
    if (testLifecycle === TestLifecycle.TEST) {
      handleSpeak();
    }
  }, [testIndex, testLifecycle, handleSpeak]);

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

  if (isAutoMode && isEmptyAutoSet)
    return (
      <Wrapper>
        <p>🎉 Amazing! You got all words correct!</p>
      </Wrapper>
    );

  if (!isAutoMode && currentWords.length === 0)
    return (
      <Wrapper>
        <p>🙁 No words here yet</p>
      </Wrapper>
    );

  if (testLifecycle === 'notStarted' || testLifecycle === 'finished') {
    return (
      <Wrapper>
        <button type="button" onClick={() => setTestLifecycle(TestLifecycle.TEST)}>
          Start 🟢
        </button>
      </Wrapper>
    );
  }

  if (testLifecycle === 'review') {
    return <Review currentWords={currentWords} isAutoMode={isAutoMode} />;
  }

  return (
    <Wrapper>
      <div className="loader-wrapper">{isSpeaking && <Loader />}</div>
      {/*  */}

      <div className="navRow">
        <button
          disabled={testIndex === 0 || isSpeaking}
          onClick={() => handleIndexChange('decrement')}
          type="button"
          aria-label="Previous week"
        >
          ◀
        </button>
        <span className="navLabel">{`${testIndex + 1} of ${sessionWordsCount} words`}</span>
        <button
          disabled={testIndex + 1 === sessionWordsCount || isSpeaking}
          onClick={() => handleIndexChange('increment')}
          type="button"
          aria-label="Next week"
        >
          ▶
        </button>
      </div>

      <button disabled={isSpeaking} type="button" onClick={handleSpeak}>
        Say word 🔈
      </button>

      <button disabled={!hasSeenAllWords} type="button" onClick={() => setTestLifecycle(TestLifecycle.REVIEW)}>
        Check Answers ✔
      </button>
      <button type="button" onClick={() => setShowCancelModal(true)}>
        Cancel 🔴
      </button>
      <Modal
        open={showCancelModal}
        setOpen={setShowCancelModal}
        actions={
          <>
            <button type="button" onClick={() => router.push('/')}>
              Yes, cancel
            </button>
            <button type="button" onClick={() => setShowCancelModal(false)}>
              Keep going
            </button>
          </>
        }
      >
        <p>Are you sure you want to cancel the test?</p>
      </Modal>
    </Wrapper>
  );
}

export default function TestWordsPage() {
  return (
    <Suspense>
      <TestWordsPageContent />
    </Suspense>
  );
}
