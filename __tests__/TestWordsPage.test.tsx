import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithContext } from './__utils__/renderWithContext';
import TestWordsPage from '../src/app/test/page';
import { initProviderState } from '../src/context/AppContext';
import { mockUser } from '../src/mockData/user';

describe('Test that the TestWords page renders expected components', () => {
  it('render loading text when context is not initialised', () => {
    renderWithContext(<TestWordsPage />, initProviderState);
    expect(screen.getByLabelText('vortex-loading')).toBeInTheDocument();
  });
  it('render error text when context error === true', () => {
    const providerProps = {
      ...initProviderState,
      loading: false,
      error: true,
    };
    renderWithContext(<TestWordsPage />, providerProps);
    expect(screen.getByText('Error...')).toBeInTheDocument();
  });
  it('render button "Start" when we have session words and the test is not started', () => {
    const providerProps = {
      ...initProviderState,
      loading: false,
      user: mockUser,
    };
    renderWithContext(<TestWordsPage />, providerProps);
    expect(screen.getByRole('button', { name: /Start/ })).toBeInTheDocument();
  });
});

describe('test if there are no words in the array', () => {
  it('render message when there are no words in the set', () => {
    //   hack as structuredClone is not implemented in jsdom
    const testUser = JSON.parse(JSON.stringify(mockUser));
    testUser.words.wordSets = [[]];
    const providerProps = {
      ...initProviderState,
      loading: false,
      user: testUser,
    };
    renderWithContext(<TestWordsPage />, providerProps);
    expect(screen.getByText(/🙁 No words here yet/)).toBeInTheDocument();
  });
});

describe('Test the TestWords page user interaction', () => {
  it('test the lifecycle of the test and the traversal of the words array with the controls', async () => {
    const providerProps = {
      ...initProviderState,
      loading: false,
      user: mockUser,
    };
    renderWithContext(<TestWordsPage />, providerProps);
    const user = userEvent.setup();
    // get and fire the start button
    await user.click(screen.getByRole('button', { name: /Start/ }));
    // get the expected controls
    const checkButton = screen.getByRole('button', { name: /Check Answers/ });
    const previousButton = screen.getByRole('button', { name: /Previous Word/ });
    const nextButton = screen.getByRole('button', { name: /Next Word/ });
    const sayWordButton = screen.getByRole('button', { name: /Say word/ });
    const cancelButton = screen.getByRole('button', { name: /Cancel/ });
    // assert that the expected controls are disabled
    expect(checkButton).toBeDisabled();
    expect(previousButton).toBeDisabled();
    // assert that the expected controls are enabled
    expect(nextButton).toBeEnabled();
    expect(sayWordButton).toBeEnabled();
    expect(cancelButton).toBeEnabled();
    // assert that current test index is as expected
    expect(screen.getByText(`1 of 10 words`)).toBeInTheDocument();
    await user.click(nextButton);
    // assert that clicking the next button changes the word
    expect(screen.queryByText(`1 of 10 words`)).toBeNull();
    expect(screen.getByText(`2 of 10 words`)).toBeInTheDocument();
    // assert that the previous button is now enabled
    expect(previousButton).toBeEnabled();
    // assert that the previous button changes the word
    await user.click(previousButton);
    expect(screen.getByText(`1 of 10 words`)).toBeInTheDocument();
    // assert that the cancel button ends the test
    await user.click(cancelButton);
    expect(screen.getByText(/Start/)).toBeInTheDocument();
    // assert that the start button starts the test again, we need to get the button again as it is a new render
    await user.click(screen.getByRole('button', { name: /Start/ }));
    expect(screen.getByText(`1 of 10 words`)).toBeInTheDocument();
  });
});
