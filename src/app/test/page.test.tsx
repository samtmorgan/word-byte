import React, { act } from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import TestWordsPage from './page';
import { mockCurrentWords, mockTestWords, oldMockUser } from '../../testUtils/mockData';
import { getCurrentWords } from '../../actions/getCurrentWords';
import { ButtonProps } from '../../components/button/Button';
import { speak } from '../../utils/wordUtils';

jest.mock('../../components', () => ({
  Loader: () => <div>mock loading</div>,
  ErrorPage: () => <div>mock error</div>,
  Button: ({ label, onClick, disabled }: ButtonProps) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  ),
  Review: () => <div>mock review</div>,
}));
jest.mock('../../actions/getCurrentWords', () => ({
  getCurrentWords: jest.fn(),
}));
jest.mock('../../utils/wordUtils', () => ({
  speak: jest.fn(),
}));

describe('TestWords page renders expected components', () => {
  it('should render loading text before the test words are loaded', async () => {
    await act(async () => {
      render(<TestWordsPage />);
    });

    expect(screen.getByText('mock loading')).toBeInTheDocument();
    expect(screen.getByText('Test time')).toBeInTheDocument();
  });

  it('should render error component when getCurrentWords returns an error', async () => {
    (getCurrentWords as jest.Mock).mockRejectedValue(new Error('mock error'));

    await act(async () => {
      render(<TestWordsPage />);
    });

    expect(screen.getByText('mock error')).toBeInTheDocument();
  });

  it('should render button "Start" when we have session words and the test is not started', async () => {
    (getCurrentWords as jest.Mock).mockResolvedValue(mockCurrentWords);

    await act(async () => {
      render(<TestWordsPage />);
    });
    expect(screen.getByRole('button', { name: /Start/ })).toBeInTheDocument();
  });

  it('should render message when there are no words in the set', async () => {
    (getCurrentWords as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      render(<TestWordsPage />);
    });

    expect(screen.getByText(/🙁 No words here yet/)).toBeInTheDocument();
  });
});

describe('TestWords page user interaction', () => {
  beforeEach(async () => {
    (getCurrentWords as jest.Mock).mockResolvedValue(mockTestWords);

    await act(async () => {
      render(<TestWordsPage />);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the start button in enabled state', async () => {
    const startButton = screen.getByRole('button', { name: /Start/ });

    expect(startButton).toBeEnabled();
  });

  it('should render the expected controls when the test is started', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Start/ }));

    const checkButton = screen.getByRole('button', { name: /Check Answers/ });
    const previousButton = screen.getByRole('button', { name: /Previous Word/ });
    const nextButton = screen.getByRole('button', { name: /Next Word/ });
    const sayWordButton = screen.getByRole('button', { name: /Say word/ });
    const cancelButton = screen.getByRole('button', { name: /Cancel/ });

    expect(checkButton).toBeDisabled();
    expect(previousButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
    expect(sayWordButton).toBeEnabled();
    expect(cancelButton).toBeEnabled();
    expect(screen.getByText(`1 of ${mockCurrentWords.length} words`)).toBeInTheDocument();
  });

  it('should cycle through the words in the test', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Start/ }));

    const previousButton = screen.getByRole('button', { name: /Previous Word/ });
    const nextButton = screen.getByRole('button', { name: /Next Word/ });

    expect(screen.getByText(/1 of 10 word/)).toBeInTheDocument();

    await user.click(nextButton);
    expect(screen.getByText(/2 of 10 word/)).toBeInTheDocument();

    await user.click(previousButton);
    expect(screen.getByText(/1 of 10 word/)).toBeInTheDocument();

    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);
    await user.click(nextButton);

    expect(screen.getByText(/10 of 10 word/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next Word/ })).toBeDisabled();

    const reviewButton = screen.getByRole('button', { name: /Check Answers/ });
    expect(reviewButton).toBeEnabled();

    await user.click(reviewButton);
    expect(screen.getByText(/mock review/)).toBeInTheDocument();
  });

  it('should call the speak function when the say word button is clicked', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Start/ }));

    const sayWordButton = screen.getByRole('button', { name: /Say word/ });
    await user.click(sayWordButton);

    expect(speak).toHaveBeenCalled();
  });

  it('should render the expected controls when the test is cancelled', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Start/ }));

    const cancelButton = screen.getByRole('button', { name: /Cancel/ });
    await user.click(cancelButton);

    expect(screen.getByText(/Test time/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Start/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Cancel/ })).not.toBeInTheDocument();
  });

  it.skip('should execute the expected test the lifecycle', async () => {
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
    const wordsListLength = oldMockUser.words.wordSets[0].length;
    expect(screen.getByText(`1 of ${wordsListLength} words`)).toBeInTheDocument();
    await user.click(nextButton);
    // assert that clicking the next button changes the word
    expect(screen.queryByText(`1 of ${wordsListLength} words`)).toBeNull();
    expect(screen.getByText(`2 of ${wordsListLength} words`)).toBeInTheDocument();
    // assert that the previous button is now enabled
    expect(previousButton).toBeEnabled();
    // assert that the previous button changes the word
    await user.click(previousButton);
    expect(screen.getByText(`1 of ${wordsListLength} words`)).toBeInTheDocument();
    // assert that the cancel button ends the test
    await user.click(cancelButton);
    expect(screen.getByText(/Start/)).toBeInTheDocument();
    // assert that the start button starts the test again, we need to get the button again as it is a new render
    await user.click(screen.getByRole('button', { name: /Start/ }));
    expect(screen.getByText(`1 of ${wordsListLength} words`)).toBeInTheDocument();
  });
});
