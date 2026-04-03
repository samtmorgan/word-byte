import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryContent from './HistoryContent';
import { Word, WordOwner } from '../../actions/types';

const makeWord = (id: string, word: string, results: { created: number; pass: boolean }[]): Word => ({
  word,
  wordId: id,
  owner: WordOwner.PLATFORM,
  results,
});

// Get the Monday of the current week at midnight
function getThisWeekMonday(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysFromMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysFromMonday);
  monday.setHours(1, 0, 0, 0); // 1am Monday to ensure it falls in the current week
  return monday;
}

describe('HistoryContent', () => {
  it('shows empty state when no words provided', () => {
    render(<HistoryContent initialWords={[]} />);
    expect(screen.getByText('No tests this week')).toBeInTheDocument();
  });

  it('shows empty state when words have no results', () => {
    render(<HistoryContent initialWords={[makeWord('w1', 'apple', [])]} />);
    expect(screen.getByText('No tests this week')).toBeInTheDocument();
  });

  it('renders table headers when sessions exist in the current week', () => {
    const ts = getThisWeekMonday().getTime();
    const words = [
      makeWord('w1', 'apple', [{ created: ts, pass: true }]),
      makeWord('w2', 'banana', [{ created: ts + 500, pass: false }]),
    ];
    render(<HistoryContent initialWords={words} />);
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Word list')).toBeInTheDocument();
    expect(screen.getByText('Result')).toBeInTheDocument();
  });

  it('renders session row with correct score', () => {
    const ts = getThisWeekMonday().getTime();
    const words = [
      makeWord('w1', 'apple', [{ created: ts, pass: true }]),
      makeWord('w2', 'banana', [{ created: ts + 500, pass: false }]),
    ];
    render(<HistoryContent initialWords={words} />);
    expect(screen.getByText('1/2')).toBeInTheDocument();
  });

  it('shows "auto" word list type for platform words', () => {
    const ts = getThisWeekMonday().getTime();
    const words = [
      makeWord('w1', 'apple', [{ created: ts, pass: true }]),
      makeWord('w2', 'banana', [{ created: ts + 500, pass: false }]),
    ];
    render(<HistoryContent initialWords={words} />);
    expect(screen.getByText('auto')).toBeInTheDocument();
  });

  it('forward (next week) button is disabled on the current week', () => {
    render(<HistoryContent initialWords={[]} />);
    expect(screen.getByRole('button', { name: /next week/i })).toBeDisabled();
  });

  it('forward button becomes enabled after navigating back a week', () => {
    render(<HistoryContent initialWords={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /previous week/i }));
    expect(screen.getByRole('button', { name: /next week/i })).not.toBeDisabled();
  });

  it('navigating back and forward returns to current week', () => {
    render(<HistoryContent initialWords={[]} />);
    const prevBtn = screen.getByRole('button', { name: /previous week/i });
    const nextBtn = screen.getByRole('button', { name: /next week/i });
    fireEvent.click(prevBtn);
    fireEvent.click(nextBtn);
    expect(nextBtn).toBeDisabled();
  });

  it('shows empty state when navigating to a week with no tests', () => {
    render(<HistoryContent initialWords={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /previous week/i }));
    expect(screen.getByText('No tests this week')).toBeInTheDocument();
  });
});
