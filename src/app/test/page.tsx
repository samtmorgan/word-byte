'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Review, ErrorPage, Loader } from '../../components';
import { getCurrentWords } from '../../actions/getCurrentWords';
import { getAutoWords } from '../../actions/getAutoWords';
import { DEFAULT_YEAR_GROUPS } from '../../actions/autoWordUtils';
import { updateAutoConfig } from '../../actions/updateAutoConfig';
import { Word, YearGroup } from '../../actions/types';
import { sayTestWord } from '../../utils/sayTestWord';

enum TestLifecycle {
  NOT_STARTED = 'notStarted',
  TEST = 'test',
  REVIEW = 'review',
  REVISE = 'revise',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

const YEAR_GROUP_LABELS: Record<YearGroup, string> = {
  year3_4: 'Year 3 & 4',
  year5_6: 'Year 5 & 6',
};

const ALL_YEAR_GROUPS: YearGroup[] = ['year3_4', 'year5_6'];

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="pageContainer">
    <h1>Test time</h1>
    {children}
  </div>
);

function TestWordsPageContent() {
  const searchParams = useSearchParams();
  const isAutoMode = searchParams.get('mode') === 'auto';

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean | string>(false);
  const [currentWords, setCurrentWords] = useState<Word[] | null>(null);
  const [isEmptyAutoSet, setIsEmptyAutoSet] = useState<boolean>(false);
  const [yearGroups, setYearGroups] = useState<YearGroup[]>(DEFAULT_YEAR_GROUPS);
  const [hasSeenAllWords, setHasSeenAllWords] = useState<boolean>(false);
  const [testIndex, setTestIndex] = useState<number>(0);
  const [testLifecycle, setTestLifecycle] = useState<TestLifecycle>(TestLifecycle.NOT_STARTED);

  useEffect(() => {
    const loadWords = async () => {
      try {
        if (isAutoMode) {
          const result = await getAutoWords();
          setYearGroups(result.yearGroups);
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
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };

    loadWords();
  }, [isAutoMode]);

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

  const handleYearGroupToggle = useCallback(
    async (group: YearGroup) => {
      const updated = yearGroups.includes(group) ? yearGroups.filter(g => g !== group) : [...yearGroups, group];

      if (updated.length === 0) return;

      setYearGroups(updated);
      setLoading(true);
      try {
        await updateAutoConfig(updated);
        const result = await getAutoWords();
        setYearGroups(result.yearGroups);
        if (result.isEmpty) {
          setIsEmptyAutoSet(true);
          setCurrentWords([]);
        } else {
          setIsEmptyAutoSet(false);
          setCurrentWords(result.words);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [yearGroups],
  );

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
        <p>🎉 Amazing! You have mastered all your words. Check back later for more!</p>
      </Wrapper>
    );

  if (!isAutoMode && currentWords.length === 0)
    return (
      <Wrapper>
        <p>🙁 No words here yet</p>
      </Wrapper>
    );

  if (testLifecycle === 'notStarted' || testLifecycle === 'finished' || testLifecycle === 'cancelled') {
    return (
      <Wrapper>
        {isAutoMode && (
          <div>
            <p>Year groups:</p>
            {ALL_YEAR_GROUPS.map(group => (
              <label key={group} style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  checked={yearGroups.includes(group)}
                  onChange={() => handleYearGroupToggle(group)}
                />{' '}
                {YEAR_GROUP_LABELS[group]}
              </label>
            ))}
          </div>
        )}
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
      <span className="cool-border-with-shadow">{`${testIndex + 1} of ${sessionWordsCount} words`}</span>

      <button disabled={testIndex === sessionWordsCount} type="button" onClick={handleSpeak}>
        Say word 🔈
      </button>
      <div style={{ gap: '1rem' }}>
        <button disabled={testIndex === 0} onClick={() => handleIndexChange('decrement')} type="button">
          👈 Previous
        </button>
        <button
          disabled={testIndex + 1 === sessionWordsCount}
          onClick={() => handleIndexChange('increment')}
          type="button"
        >
          Next 👉
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

export default function TestWordsPage() {
  return (
    <Suspense>
      <TestWordsPageContent />
    </Suspense>
  );
}
