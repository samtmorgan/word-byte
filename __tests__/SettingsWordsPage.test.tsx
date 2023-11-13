import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithContext } from './__utils__/renderWithContext';
import SettingsWords from '../src/app/settingsWords/page';
// import { mockUser } from '../src/mockData/user';
// import { buildSessionWords } from '../src/utils/wordUtils';
import { initProviderState } from '../src/context/AppContext';

describe('Test the SettingsWords page renders as expected', () => {
  it('render loading text when context is loading', () => {
    renderWithContext(<SettingsWords />, initProviderState);
    //   expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByLabelText('vortex-loading')).toBeInTheDocument();
  });
  it('render message when there are words in the set', () => {
    const providerProps = { ...initProviderState };
    const user = { words: { wordSets: [[]] } };
    Object.defineProperty(providerProps, 'user', { value: user });
    renderWithContext(<SettingsWords />, providerProps);
    expect(screen.getByText(/🙁 No words here yet/)).toBeInTheDocument();
  });
  //   it('renders an input, label and button for adding words', () => {
  //     const providerProps = { ...initProviderState };
  //     const user = { words: { wordSets: [[]] } };
  //     Object.defineProperty(providerProps, 'user', { value: user });
  //     renderWithContext(<SettingsWords />, providerProps);
  //     expect(screen.getByRole('textbox', { name: 'Add new word' })).toBeInTheDocument();
  //     expect(screen.getByRole('button')).toBeInTheDocument();
  //     expect(screen.getByLabelText('Add new word')).toBeInTheDocument();
  //   });
  //   it('renders a button for removing words', () => {
  //     const providerProps = { ...initProviderState };
  //     const user = { words: { wordSets: [[]] } };
  //     Object.defineProperty(providerProps, 'user', { value: user });
  //     renderWithContext(<SettingsWords />, providerProps);
  //     expect(screen.getByRole('textbox', { name: 'Add new word' })).toBeInTheDocument();
  //     expect(screen.getByRole('button')).toBeInTheDocument();
  //     expect(screen.getByLabelText('Add new word')).toBeInTheDocument();
  //   });

  //   it('render error text when context error === true', () => {
  //     const providerProps = {
  //       ...initProviderState,
  //       loading: false,
  //       error: true,
  //     };
  //     renderWithContext(<TestWordsPage />, providerProps);
  //     expect(screen.getByText('Error...')).toBeInTheDocument();
  //   });
  //   it('render info text when words array is empty', () => {
  //     const providerProps = {
  //       ...initProviderState,
  //       loading: false,
  //       sessionWords: [],
  //     };
  //     renderWithContext(<TestWordsPage />, providerProps);
  //     expect(screen.getByText('No words')).toBeInTheDocument();
  //   });
  //   it('render button "Start" when we have session words and the test is not started', () => {
  //     const sessionWordsArr = buildSessionWords(mockUser?.words.wordSets[0] || []);
  //     const providerProps = {
  //       ...initProviderState,
  //       loading: false,
  //       sessionWords: sessionWordsArr,
  //       testLifecycle: 'notStarted',
  //     };
  //     renderWithContext(<TestWordsPage />, providerProps);
  //     expect(screen.getByRole('button', { name: /Start/ })).toBeInTheDocument();
  //   });
  //   it('expected elements are rendered when testLifecycle === "test"', () => {
  //     const sessionWordsArr = buildSessionWords(mockUser?.words.wordSets[0] || []);
  //     const providerProps = {
  //       ...initProviderState,
  //       loading: false,
  //       error: false,
  //       sessionWords: sessionWordsArr,
  //       testLifecycle: 'test',
  //     };
  //     renderWithContext(<TestWordsPage />, providerProps);
  //     expect(screen.getByText(`1 of ${sessionWordsArr.length} words`)).toBeInTheDocument();
  //     expect(screen.getByRole('button', { name: /Say word/ })).toBeInTheDocument();
  //     expect(screen.getByRole('button', { name: /Previous Word/ })).toBeInTheDocument();
  //     expect(screen.getByRole('button', { name: /Next Word/ })).toBeInTheDocument();
  //     expect(screen.getByRole('button', { name: /Check Answers/ })).toBeInTheDocument();
  //     expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
  //   });
});
