'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { set } from 'react-hook-form';
// import { useAppContext } from '../../context/AppContext';
import { speak } from '../../utils/wordUtils';
import Loader from '../../components/loader/Loader';
import { TestLifecycleType } from '../../types/types';
import { Button, Review, Error } from '../../components';
import { getUser } from '../../actions/actions';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <>
    <h1>Test time</h1>
    {children}
  </>
);

export default function TestWordsPage() {
  // const { testWords, loading, error } = useAppContext();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean | string>(false);
  const [testWords, setTestWords] = useState<string[] | null>(null);
  const [hasSeenAllWords, setHasSeenAllWords] = useState<boolean>(false);
  const [testIndex, setTestIndex] = useState<number>(0);
  const [testLifecycle, setTestLifecycle] = useState<TestLifecycleType | null>('notStarted');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRecord = await getUser('testUserAuthId');
        console.log(userRecord);
        setLoading(false);
        setTestWords([]);
        setUser(userRecord);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

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

  if (error)
    return (
      <Wrapper>
        <Error />
      </Wrapper>
    );

  if (loading || !testWords)
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );

  if (testWords.length === 0)
    return (
      <Wrapper>
        <div>🙁 No words here yet</div>
      </Wrapper>
    );

  if (testLifecycle === 'notStarted' || testLifecycle === 'finished' || testLifecycle === 'cancelled') {
    return (
      <div className="page-container">
        <Wrapper>
          <Button label="Start 🟢" onClick={() => setTestLifecycle('test')} />
        </Wrapper>
      </div>
    );
  }

  if (testLifecycle === 'review') {
    return (
      <Wrapper>
        <Review />
      </Wrapper>
    );
  }

  return (
    <div className="page-container">
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
        <Button disabled={!hasSeenAllWords} label="Check Answers ✔" onClick={() => setTestLifecycle('review')} />
        <Button label="Cancel 🔴" onClick={() => setTestLifecycle('cancelled')} />
      </Wrapper>
    </div>
  );
}
