import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithContext } from './__utils__/renderWithContext';
import SettingsWords from '../src/app/settingsWords/page';
import { initProviderState } from '../src/context/AppContext';
import { mockUser } from '../src/mockData/user';

function renderWithContextAndInitState() {
  const providerProps = { ...initProviderState };
  const user = mockUser;
  Object.defineProperty(providerProps, 'user', { value: user });
  return renderWithContext(<SettingsWords />, providerProps);
}

describe('Test the SettingsWords page renders as expected', () => {
  it('render loading text when context is loading', () => {
    renderWithContext(<SettingsWords />, initProviderState);
    expect(screen.getByLabelText('vortex-loading')).toBeInTheDocument();
  });
  it('render message when there are words in the set', () => {
    const providerProps = { ...initProviderState };
    const user = { words: { wordSets: [[]] } };
    Object.defineProperty(providerProps, 'user', { value: user });
    renderWithContext(<SettingsWords />, providerProps);
    expect(screen.getByText(/🙁 No words here yet/)).toBeInTheDocument();
  });
  it('renders a button to start editing the word list', () => {
    renderWithContextAndInitState();
    expect(screen.getByRole('button', { name: /Edit/ })).toBeInTheDocument();
  });
  it('edit button should change to finish when clicked', async () => {
    const user = userEvent.setup();
    // render your component
    renderWithContextAndInitState();
    // access your button
    const button = screen.getByRole('button', { name: /Edit/ });
    // simulate button click
    await user.click(button);
    // expect result
    expect(screen.getByRole('button', { name: /Finish/ })).toBeInTheDocument();
  });
  it('edit button should change from edit to finish to edit when clicked', async () => {
    const user = userEvent.setup();
    renderWithContextAndInitState();
    const button = screen.getByRole('button', { name: /Edit/ });
    await user.click(button);
    expect(screen.getByRole('button', { name: /Finish/ })).toBeInTheDocument();
    await user.click(button);
    expect(screen.getByRole('button', { name: /Edit/ })).toBeInTheDocument();
  });
  it('when in edit mode, renders an input, label and button for adding words', async () => {
    const user = userEvent.setup();
    renderWithContextAndInitState();
    const button = screen.getByRole('button', { name: /Edit/ });
    await user.click(button);
    expect(screen.getByRole('button', { name: /Add/ })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Add new word *capitalisation matters' })).toBeInTheDocument();
  });
  it('when in edit mode, render a remove button for each word', async () => {
    const user = userEvent.setup();
    renderWithContextAndInitState();
    const button = screen.getByRole('button', { name: /Edit/ });
    await user.click(button);
    const targetButtonNames = mockUser.words.wordSets[0].map(word => `Remove word: ${word}`);
    expect(targetButtonNames.every(name => screen.getByRole('button', { name }))).toEqual(true);
  });
  it('renders a list with the same amount of words as in the user object', () => {
    renderWithContextAndInitState();
    const targetLength = mockUser.words.wordSets[0].length;
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(targetLength);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
  it('renders each word as in the user object', () => {
    renderWithContextAndInitState();
    const targetWords = mockUser.words.wordSets[0];
    expect(targetWords?.every(word => screen.getByText(word))).toEqual(true);
  });
  it('when remove word button is clicked, the word is removed from the list', async () => {
    const user = userEvent.setup();
    renderWithContextAndInitState();
    const button = screen.getByRole('button', { name: /Edit/ });
    await user.click(button);
    const targetButtonNames = mockUser.words.wordSets[0].map(word => `Remove word: ${word}`);
    const targetButton = screen.getByRole('button', { name: targetButtonNames?.[0] });
    await user.click(targetButton);
    expect(screen.queryByText(targetButtonNames[0])).not.toBeInTheDocument();
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
