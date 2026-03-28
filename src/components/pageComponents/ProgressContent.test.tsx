import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProgressContent from './ProgressContent';
import { Word, WordOwner } from '../../actions/types';

const now = Date.now();

const makeWord = (
  id: string,
  word: string,
  owner: WordOwner,
  yearGroup?: 'year3_4' | 'year5_6',
  results: { created: number; pass: boolean }[] = [],
): Word => ({
  word,
  wordId: id,
  owner,
  results,
  yearGroup,
});

const year34Words: Word[] = [
  makeWord('y34a', 'apple', WordOwner.PLATFORM, 'year3_4', [
    { created: now - 3000, pass: true },
    { created: now - 2000, pass: false },
    { created: now - 1000, pass: true },
  ]),
  makeWord('y34b', 'banana', WordOwner.PLATFORM, 'year3_4', []),
];

const year56Words: Word[] = [
  makeWord('y56a', 'elephant', WordOwner.PLATFORM, 'year5_6', [
    { created: now - 1000, pass: false },
  ]),
];

const userWords: Word[] = [
  makeWord('u1', 'custom', WordOwner.USER, undefined, [
    { created: now - 2000, pass: true },
    { created: now - 1000, pass: true },
  ]),
];

describe('ProgressContent', () => {
  it('shows empty state when no words provided', () => {
    render(<ProgressContent initialWords={[]} />);
    expect(screen.getByText('No words yet.')).toBeInTheDocument();
  });

  it('renders word stats for the active group', () => {
    render(<ProgressContent initialWords={year34Words} />);
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('banana')).toBeInTheDocument();
  });

  it('shows correct stats for a word with results', () => {
    render(<ProgressContent initialWords={year34Words} />);
    // apple has 3 attempts, 2 passes, 1 fail, 67% success
    const rows = screen.getAllByRole('row');
    // row 0 = header, row 1 = apple, row 2 = banana
    expect(rows[1]).toHaveTextContent('apple');
    expect(rows[1]).toHaveTextContent('3'); // attempts
    expect(rows[1]).toHaveTextContent('2'); // passes
    expect(rows[1]).toHaveTextContent('1'); // fails
    expect(rows[1]).toHaveTextContent('67%');
  });

  it('shows – for success rate when a word has no attempts', () => {
    render(<ProgressContent initialWords={year34Words} />);
    const rows = screen.getAllByRole('row');
    expect(rows[2]).toHaveTextContent('banana');
    expect(rows[2]).toHaveTextContent('–');
  });

  it('renders streak icons correctly', () => {
    render(<ProgressContent initialWords={year34Words} />);
    const rows = screen.getAllByRole('row');
    // apple's last 3 results sorted desc: pass(now-1000), fail(now-2000), pass(now-3000) → ✅❌✅
    expect(rows[1]).toHaveTextContent('✅❌✅');
  });

  it('shows group navigation with correct label', () => {
    render(<ProgressContent initialWords={[...year34Words, ...year56Words]} />);
    expect(screen.getByText('Year 3/4')).toBeInTheDocument();
  });

  it('clicking next navigates to the next group', () => {
    render(<ProgressContent initialWords={[...year34Words, ...year56Words]} />);
    expect(screen.getByText('Year 3/4')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /next group/i }));
    expect(screen.getByText('Year 5/6')).toBeInTheDocument();
    expect(screen.getByText('elephant')).toBeInTheDocument();
  });

  it('clicking prev navigates back to the previous group', () => {
    render(<ProgressContent initialWords={[...year34Words, ...year56Words]} />);
    fireEvent.click(screen.getByRole('button', { name: /next group/i }));
    fireEvent.click(screen.getByRole('button', { name: /previous group/i }));
    expect(screen.getByText('Year 3/4')).toBeInTheDocument();
  });

  it('prev button is disabled on the first group', () => {
    render(<ProgressContent initialWords={year34Words} />);
    expect(screen.getByRole('button', { name: /previous group/i })).toBeDisabled();
  });

  it('next button is disabled on the last group', () => {
    render(<ProgressContent initialWords={year34Words} />);
    expect(screen.getByRole('button', { name: /next group/i })).toBeDisabled();
  });

  it('groups with no words are excluded from navigation', () => {
    // Only year3_4 and user words — year5_6 has none
    render(<ProgressContent initialWords={[...year34Words, ...userWords]} />);
    // Navigate to end
    fireEvent.click(screen.getByRole('button', { name: /next group/i }));
    expect(screen.getByText('My Words')).toBeInTheDocument();
    // Next should be disabled — Year 5/6 is not shown
    expect(screen.getByRole('button', { name: /next group/i })).toBeDisabled();
  });

  it('renders My Words group correctly', () => {
    render(<ProgressContent initialWords={userWords} />);
    expect(screen.getByText('My Words')).toBeInTheDocument();
    expect(screen.getByText('custom')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
