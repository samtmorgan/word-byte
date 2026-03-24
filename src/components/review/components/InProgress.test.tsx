import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { InProgress } from './InProgress';
import { LocalResults } from '../types';

const mockResults: LocalResults = [
  { word: 'testWord1', wordId: 'testWordId1', pass: null },
  { word: 'testWord2', wordId: 'testWordId2', pass: null },
];

describe('InProgress component', () => {
  it('should render the heading and instruction', () => {
    render(<InProgress results={mockResults} setResults={jest.fn()} />);

    expect(screen.getByText('Time to check your spellings!')).toBeInTheDocument();
    expect(screen.getByText('Click the words you got right ✓')).toBeInTheDocument();
  });

  it('should render a button for each word', () => {
    render(<InProgress results={mockResults} setResults={jest.fn()} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(mockResults.length);
    expect(screen.getByRole('button', { name: /testWord1/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /testWord2/ })).toBeInTheDocument();
  });

  it('should call setResults with pass=true when a word is clicked', async () => {
    const setResults = jest.fn();
    const user = userEvent.setup();
    render(<InProgress results={mockResults} setResults={setResults} />);

    await user.click(screen.getAllByRole('button')[0]);

    expect(setResults).toHaveBeenCalledWith([
      { word: 'testWord1', wordId: 'testWordId1', pass: true },
      { word: 'testWord2', wordId: 'testWordId2', pass: null },
    ]);
  });

  it('should toggle pass back to false when a correct word is clicked again', async () => {
    const passedResults: LocalResults = [
      { word: 'testWord1', wordId: 'testWordId1', pass: true },
      { word: 'testWord2', wordId: 'testWordId2', pass: null },
    ];
    const setResults = jest.fn();
    const user = userEvent.setup();
    render(<InProgress results={passedResults} setResults={setResults} />);

    await user.click(screen.getAllByRole('button')[0]);

    expect(setResults).toHaveBeenCalledWith([
      { word: 'testWord1', wordId: 'testWordId1', pass: false },
      { word: 'testWord2', wordId: 'testWordId2', pass: null },
    ]);
  });

  it('should show ✓ on words that have pass=true', () => {
    const resultsWithPass: LocalResults = [
      { word: 'testWord1', wordId: 'testWordId1', pass: true },
      { word: 'testWord2', wordId: 'testWordId2', pass: null },
    ];
    render(<InProgress results={resultsWithPass} setResults={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'testWord1 ✓' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'testWord2' })).toBeInTheDocument();
  });

  it('should apply correct-word class to words with pass=true', () => {
    const resultsWithPass: LocalResults = [
      { word: 'testWord1', wordId: 'testWordId1', pass: true },
      { word: 'testWord2', wordId: 'testWordId2', pass: null },
    ];
    render(<InProgress results={resultsWithPass} setResults={jest.fn()} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('correct-word');
    expect(buttons[1]).not.toHaveClass('correct-word');
  });
});
