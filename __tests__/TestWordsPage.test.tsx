import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { initProviderProps, renderWithContext } from './__utils__/renderWithContext';
import TestWordsPage from '../src/app/test/page';
import { mockUser } from '../src/mockData/user';
import { buildSessionWords } from '../src/utils/wordUtils';

describe('Test that the TestWords page render as expected', () => {
  it('render loading text when context is not initialised', () => {
    renderWithContext(<TestWordsPage />, initProviderProps);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  it('render error text when context is not initialised', () => {
    const errorProviderProps = {
      ...initProviderProps,
      loading: false,
      error: true,
    };
    renderWithContext(<TestWordsPage />, errorProviderProps);
    expect(screen.getByText('Error...')).toBeInTheDocument();
  });
  it('render error text when context is not initialised', () => {
    const errorProviderProps = {
      ...initProviderProps,
      loading: false,
      sessionWords: [],
    };
    renderWithContext(<TestWordsPage />, errorProviderProps);
    expect(screen.getByText('No words')).toBeInTheDocument();
  });
  it('expected elements are rendered when in test and the session words value is populated', () => {
    const sessionWordsArr = buildSessionWords(mockUser?.words || []);
    const successProviderProps = {
      ...initProviderProps,
      loading: false,
      error: false,
      sessionWords: sessionWordsArr,
    };
    renderWithContext(<TestWordsPage />, successProviderProps);
    expect(screen.getByText(`1 of ${sessionWordsArr.length} words`)).toBeInTheDocument();
  });
});
