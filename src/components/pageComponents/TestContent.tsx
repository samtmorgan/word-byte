'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Review, Loader } from '..';
import { NavRow } from '../navRow/NavRow';
import { Modal } from '../modal/Modal';
import { Word } from '../../actions/types';
import { sayTestWord } from '../../utils/sayTestWord';

enum TestLifecycle {
  TEST = 'test',
  REVIEW = 'review',
}

interface TestContentProps {
  initialWords: Word[];
  isAutoMode: boolean;
}

export default function TestContent({ initialWords, isAutoMode }: TestContentProps) {
  const [testIndex, setTestIndex] = useState<number>(0);
  const [testLifecycle, setTestLifecycle] = useState<TestLifecycle>(TestLifecycle.TEST);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hasSeenAllWords, setHasSeenAllWords] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const router = useRouter();

  const sessionWordsCount = useMemo(() => initialWords.length, [initialWords]);

  const handleSpeak = useCallback(async () => {
    setIsSpeaking(true);
    try {
      await sayTestWord(initialWords, testIndex);
    } finally {
      setIsSpeaking(false);
    }
  }, [initialWords, testIndex]);

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

  if (testLifecycle === TestLifecycle.REVIEW) {
    return <Review currentWords={initialWords} isAutoMode={isAutoMode} />;
  }

  return (
    <div className="pageContainer">
      <div className="loader-wrapper">{isSpeaking && <Loader />}</div>

      <NavRow
        label={`${testIndex + 1} of ${sessionWordsCount} words`}
        onPrev={() => handleIndexChange('decrement')}
        onNext={() => handleIndexChange('increment')}
        prevDisabled={testIndex === 0 || isSpeaking}
        nextDisabled={testIndex + 1 === sessionWordsCount || isSpeaking}
        prevAriaLabel="Previous"
        nextAriaLabel="Next"
      />

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
    </div>
  );
}
