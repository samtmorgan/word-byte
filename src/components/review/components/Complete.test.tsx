import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Complete } from './Complete';
import { LocalResults } from '../types';

jest.mock('../../confetti/Confetti', () => () => <div>MockConfetti</div>);

const allPassedResults: LocalResults = [
  { word: 'testWord1', wordId: 'testWordId1', pass: true },
  { word: 'testWord2', wordId: 'testWordId2', pass: true },
];

const mixedResults: LocalResults = [
  { word: 'testWord1', wordId: 'testWordId1', pass: true },
  { word: 'testWord2', wordId: 'testWordId2', pass: false },
];

const allFailedResults: LocalResults = [
  { word: 'testWord1', wordId: 'testWordId1', pass: false },
  { word: 'testWord2', wordId: 'testWordId2', pass: false },
];

describe('Complete component', () => {
  it('should render a perfect score message when all words passed', () => {
    render(<Complete results={allPassedResults} />);

    expect(screen.getByText('Perfect score!')).toBeInTheDocument();
    expect(screen.getByText('You spelled all 2 words correctly. Amazing work!')).toBeInTheDocument();
  });

  it('should render an encouraging message with mixed results', () => {
    render(<Complete results={mixedResults} />);

    expect(screen.getByText('Good going!')).toBeInTheDocument();
    expect(
      screen.getByText("You got 1 out of 2 right. Keep practising and you'll get even more next time."),
    ).toBeInTheDocument();
  });

  it('should render a supportive message when no words passed', () => {
    render(<Complete results={allFailedResults} />);

    expect(screen.getByText('Keep going!')).toBeInTheDocument();
    expect(
      screen.getByText('These are tricky words. Practising them a few times will make a big difference.'),
    ).toBeInTheDocument();
  });

  it('should show confetti when all words are correct', () => {
    render(<Complete results={allPassedResults} />);

    expect(screen.getByText('MockConfetti')).toBeInTheDocument();
    expect(screen.queryByText('Want to practice?')).not.toBeInTheDocument();
  });

  it('should show words to practice when some words failed', () => {
    render(<Complete results={mixedResults} />);

    expect(screen.getByText('Want to practice?')).toBeInTheDocument();
    expect(screen.getByText('testWord2')).toBeInTheDocument();
    expect(screen.queryByText('MockConfetti')).not.toBeInTheDocument();
  });

  it('should not show passed words in the practice list', () => {
    render(<Complete results={mixedResults} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent('testWord2');
  });

  it('should show all words in practice list when all failed', () => {
    render(<Complete results={allFailedResults} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });
});
