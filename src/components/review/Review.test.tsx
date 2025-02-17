import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import Review from './Review';
import { mockCurrentWords } from '../../testUtils/mockData';
import { Word } from '../../actions/types';

jest.mock('./components/InProgress', () => ({
  InProgress: () => <div>MockInProgress</div>,
}));
jest.mock('./components/Complete', () => ({
  Complete: () => <div>MockComplete</div>,
}));

describe.only('Review component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render message when there are no words in the set', () => {
    render(<Review currentWords={[]} />);

    expect(screen.getByText(/🙁 No words here yet/)).toBeInTheDocument();
  });

  it('should render the in progress view on mount', async () => {
    render(<Review currentWords={mockCurrentWords as Word[]} />);

    expect(screen.getByText(/MockInProgress/)).toBeInTheDocument();
  });

  it('should render the review complete view when the user clicks the finish button', async () => {
    render(<Review currentWords={mockCurrentWords as Word[]} />);
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: '🏁 Finish' });
    await user.click(button);
    expect(screen.getByText(/MockComplete/)).toBeInTheDocument();
    expect(screen.queryByText(/MockInProgress/)).not.toBeInTheDocument();
  });

  it.skip('should render expected content when there are words in the set', () => {
    const { container } = render(<Review currentWords={mockCurrentWords as Word[]} />);

    expect(screen.getByText(/Click the words you got right ✓/)).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toEqual(mockCurrentWords.length);
    expect(container).toMatchSnapshot();
  });

  it.skip('should respond to user interaction', async () => {
    render(<Review currentWords={mockCurrentWords.slice(0, 1) as Word[]} />);

    const firstWord = mockCurrentWords[0].word;
    const user = userEvent.setup();
    let button = screen.getAllByRole('button')[0];

    await user.click(button);

    expect(screen.getByText(`${firstWord} ✓`)).toBeInTheDocument();

    await user.click(button);

    [button] = screen.getAllByRole('button');

    expect(screen.queryByText(`${firstWord} `)).toBeInTheDocument();
    expect(screen.queryByText(firstWord)).toBeInTheDocument();
  });

  it.skip('should render the fireworks when the user has reviewed all the words and they are correct', async () => {
    render(<Review currentWords={mockCurrentWords.slice(0, 1) as Word[]} />);
    const button = screen.getAllByRole('button')[0];
    const user = userEvent.setup();

    await user.click(button);

    expect(screen.getByText(/Confetti/)).toBeInTheDocument();
  });
});
