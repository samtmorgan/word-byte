import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import Review from './Review';
import { mockCurrentWords } from '../../testUtils/mockData';
import { Word } from '../../actions/types';
import { addTestResults } from '../../actions/addTestResults';

jest.mock('./components/InProgress', () => ({
  InProgress: () => <div>MockInProgress</div>,
}));
jest.mock('./components/Complete', () => ({
  Complete: () => <div>MockComplete</div>,
}));
jest.mock('../../actions/addTestResults', () => ({
  addTestResults: jest.fn().mockResolvedValue({ success: true }),
}));

const expectedLocalResults = [
  { word: 'testWord1', wordId: 'testWordId1', pass: null },
  { word: 'testWord2', wordId: 'testWordId2', pass: null },
];

describe('Review component', () => {
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

  it('should show the finish button when in progress', () => {
    render(<Review currentWords={mockCurrentWords as Word[]} />);

    expect(screen.getByRole('button', { name: '🏁 Finish' })).toBeInTheDocument();
  });

  it('should render the review complete view when the user clicks the finish button', async () => {
    render(<Review currentWords={mockCurrentWords as Word[]} />);
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: '🏁 Finish' });

    await user.click(button);

    expect(screen.getByText(/MockComplete/)).toBeInTheDocument();
    expect(screen.queryByText(/MockInProgress/)).not.toBeInTheDocument();
  });

  it('should call addTestResults with results and isAutoMode=false when finish is clicked', async () => {
    render(<Review currentWords={mockCurrentWords as Word[]} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '🏁 Finish' }));

    expect(addTestResults).toHaveBeenCalledWith({ localResults: expectedLocalResults, isAutoMode: false });
  });

  it('should call addTestResults with isAutoMode=true when prop is set', async () => {
    render(<Review currentWords={mockCurrentWords as Word[]} isAutoMode />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '🏁 Finish' }));

    expect(addTestResults).toHaveBeenCalledWith({ localResults: expectedLocalResults, isAutoMode: true });
  });

  it('should show the done link after finishing', async () => {
    render(<Review currentWords={mockCurrentWords as Word[]} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '🏁 Finish' }));

    expect(screen.getByRole('link', { name: 'Done' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '🏁 Finish' })).not.toBeInTheDocument();
  });

  it('should not call addTestResults more than once', async () => {
    render(<Review currentWords={mockCurrentWords as Word[]} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: '🏁 Finish' }));

    expect(addTestResults).toHaveBeenCalledTimes(1);
  });
});
