import React from 'react';
import { getCurrentWords } from '../../actions/getCurrentWords';
import { getAutoWords } from '../../actions/getAutoWords';
import { ErrorPage } from '../../components';
import TestContent from '../../components/pageComponents/TestContent';

const Wrapper = ({ children }: { children: React.ReactNode }) => <div className="pageContainer">{children}</div>;

export default async function TestWordsPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  const isAutoMode = mode === 'auto';

  try {
    if (isAutoMode) {
      const result = await getAutoWords();

      if (result.isEmpty) {
        return (
          <Wrapper>
            <p>🎉 Amazing! You got all words correct!</p>
          </Wrapper>
        );
      }

      return <TestContent initialWords={result.words} isAutoMode />;
    }

    const words = await getCurrentWords();

    if (!words || words.length === 0) {
      return (
        <Wrapper>
          <p>🙁 No words here yet</p>
        </Wrapper>
      );
    }

    return <TestContent initialWords={words} isAutoMode={false} />;
  } catch {
    return (
      <Wrapper>
        <ErrorPage />
      </Wrapper>
    );
  }
}
