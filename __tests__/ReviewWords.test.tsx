import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithContext } from './__utils__/renderWithContext';
import { initProviderState } from '../src/context/AppContext';
import { mockUser } from '../src/mockData/user';
import Review from '../src/components/Review';
import { mockTestWords } from './__utils__/mockData/mockData';

function renderWithContextAndInitState() {
  const providerProps = {
    ...initProviderState,
    loading: false,
    user: mockUser,
    testWords: mockTestWords,
  };
  return renderWithContext(<Review />, providerProps);
}

describe('Test the Review component placeholders', () => {
  it('render message when there are no words in the set', () => {
    //   hack as structuredClone is not implemented in jsdom
    const testUser = JSON.parse(JSON.stringify(mockUser));
    testUser.words.wordSets = [[]];
    const providerProps = {
      ...initProviderState,
      loading: false,
      user: testUser,
      testWords: [],
    };
    renderWithContext(<Review />, providerProps);
    expect(screen.getByText(/🙁 No words here yet/)).toBeInTheDocument();
  });
});

describe('Test the Review component elements', () => {
  beforeEach(() => renderWithContextAndInitState());
  it('render a h1 with expected text', () => {
    expect(screen.getByRole('heading', { name: 'Click the words you got right ✓' })).toBeInTheDocument();
  });
  it('render a list of words', () => {
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
  it('render a list of words of the correct length', () => {
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toEqual(mockUser.words.wordSets[0].length);
  });
  it('render a list of buttons of the correct length', () => {
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toEqual(mockUser.words.wordSets[0].length);
  });
  it('renders each word as in the user object', () => {
    const targetWords = mockUser.words.wordSets[0];
    expect(targetWords?.every(word => screen.getByText(word))).toEqual(true);
  });
});

describe('Test the Review component user interaction', () => {
  it('when a button is clicked the content changes', async () => {
    renderWithContextAndInitState();
    const firstWord = mockUser.words.wordSets[0][0];
    const user = userEvent.setup();
    const button = screen.getAllByRole('button')[0];
    await user.click(button);
    expect(screen.getByText(`${firstWord} ✓`)).toBeInTheDocument();
    await user.click(button);
    expect(screen.queryByText(`${firstWord} ✓`)).not.toBeInTheDocument();
    expect(screen.queryByText(firstWord)).toBeInTheDocument();
  });
});
