import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import WordListsContent from './WordListsContent';
import { deleteWordList } from '../../actions/deleteWordList';
import { promoteWordList } from '../../actions/promoteWordList';
import { createWordList } from '../../actions/createWordList';
import { checkSpelling } from '../../utils/spellCheck';
import { WordOwner, Word, WordSet } from '../../actions/types';

Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: () => 'mock-uuid' },
});

jest.mock('../../actions/deleteWordList', () => ({
  deleteWordList: jest.fn(),
}));
jest.mock('../../actions/promoteWordList', () => ({
  promoteWordList: jest.fn(),
}));
jest.mock('../../actions/createWordList', () => ({
  createWordList: jest.fn(),
}));
jest.mock('../../utils/spellCheck', () => ({
  checkSpelling: jest.fn(),
}));
jest.mock('../modal/Modal', () => ({
  Modal: ({ open, children, actions }: { open: boolean; children: React.ReactNode; actions: React.ReactNode }) =>
    open ? (
      <div role="dialog">
        {children}
        {actions}
      </div>
    ) : null,
}));

const mockWords: Word[] = [
  { word: 'apple', wordId: 'w1', owner: WordOwner.PLATFORM, results: [], yearGroup: 'year3_4' },
  { word: 'banana', wordId: 'w2', owner: WordOwner.PLATFORM, results: [], yearGroup: 'year5_6' },
  { word: 'custom', wordId: 'w3', owner: WordOwner.USER, results: [] },
];

const mockWordSets: WordSet[] = [
  { wordSetId: 'ws1', createdAt: 100, wordIds: ['w1', 'w2'] },
  { wordSetId: 'ws2', createdAt: 200, wordIds: ['w3'] },
];

describe('WordListsContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (checkSpelling as jest.Mock).mockResolvedValue({ valid: true });
    (createWordList as jest.Mock).mockResolvedValue({ success: true, data: undefined });
    (deleteWordList as jest.Mock).mockResolvedValue({ success: true, data: undefined });
    (promoteWordList as jest.Mock).mockResolvedValue({ success: true, data: undefined });
  });

  describe('empty state', () => {
    it('shows empty message when no word sets and no auto words', () => {
      render(<WordListsContent initialWordSets={[]} initialWords={[]} initialAutoWordSet={[]} />);
      expect(screen.getByText('No word lists yet.')).toBeInTheDocument();
    });

    it('shows New List button in empty state', () => {
      render(<WordListsContent initialWordSets={[]} initialWords={[]} initialAutoWordSet={[]} />);
      expect(screen.getByRole('button', { name: /new list/i })).toBeInTheDocument();
    });
  });

  describe('list navigation', () => {
    it('renders word list with words', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      expect(screen.getByText('apple')).toBeInTheDocument();
      expect(screen.getByText('banana')).toBeInTheDocument();
    });

    it('shows list count', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    it('navigates to next list', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /next list/i }));
      expect(screen.getByText('custom')).toBeInTheDocument();
      expect(screen.getByText('2 / 2')).toBeInTheDocument();
    });

    it('disables previous button on first list', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      expect(screen.getByRole('button', { name: /previous list/i })).toBeDisabled();
    });

    it('disables next button on last list', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /next list/i }));
      expect(screen.getByRole('button', { name: /next list/i })).toBeDisabled();
    });

    it('shows Custom badge for manual lists', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('shows Auto badge when auto word set is present', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={['w1']} />);
      expect(screen.getByText('Auto')).toBeInTheDocument();
    });

    it('shows Current Custom List badge for first manual list', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      expect(screen.getByText('Current Custom List')).toBeInTheDocument();
    });
  });

  describe('auto word set', () => {
    it('shows auto list as first entry', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={['w1']} />);
      expect(screen.getByText('Auto')).toBeInTheDocument();
      expect(screen.getByText('apple')).toBeInTheDocument();
    });

    it('disables delete button for auto list', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={['w1']} />);
      expect(screen.getByText('🗑️').closest('button')).toBeDisabled();
    });

    it('disables promote button for auto list', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={['w1']} />);
      expect(screen.getByText('⭐️').closest('button')).toBeDisabled();
    });
  });

  describe('delete flow', () => {
    it('opens delete confirmation modal', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByText('🗑️').closest('button')!);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/delete this list/i)).toBeInTheDocument();
    });

    it('shows word count in delete modal', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByText('🗑️').closest('button')!);
      expect(screen.getByText(/2 words/)).toBeInTheDocument();
    });

    it('removes list on confirm and calls server action', async () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByText('🗑️').closest('button')!);
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      });
      expect(screen.queryByText('apple')).not.toBeInTheDocument();
    });

    it('closes modal on cancel', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByText('🗑️').closest('button')!);
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('promote', () => {
    it('disables promote for the first custom list', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      expect(screen.getByText('⭐️').closest('button')).toBeDisabled();
    });

    it('enables promote for non-first custom lists', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /next list/i }));
      expect(screen.getByText('⭐️').closest('button')).not.toBeDisabled();
    });

    it('promotes list and calls server action', async () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /next list/i }));
      await act(async () => {
        fireEvent.click(screen.getByText('⭐️').closest('button')!);
      });
      expect(screen.getByText('Current Custom List')).toBeInTheDocument();
    });
  });

  describe('create list form', () => {
    it('switches to create mode when clicking + New List', () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      expect(screen.getByText('Add a new word')).toBeInTheDocument();
    });

    it('shows create button from action row', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByText('➕').closest('button')!);
      expect(screen.getByText('Add a new word')).toBeInTheDocument();
    });

    it('returns to list view on cancel', () => {
      render(<WordListsContent initialWordSets={mockWordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByText('➕').closest('button')!);
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.getByText('apple')).toBeInTheDocument();
    });

    it('shows error when submitting empty new word', async () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      fireEvent.submit(screen.getByLabelText(/add a new word/i).closest('form')!);
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Word needs some letters');
      });
    });

    it('shows error for invalid characters', async () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      fireEvent.change(screen.getByLabelText(/add a new word/i), { target: { value: 'hello world' } });
      fireEvent.submit(screen.getByLabelText(/add a new word/i).closest('form')!);
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Letters only');
      });
    });

    it('shows error for duplicate word', async () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      fireEvent.change(screen.getByLabelText(/add a new word/i), { target: { value: 'apple' } });
      fireEvent.submit(screen.getByLabelText(/add a new word/i).closest('form')!);
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Word already in list');
      });
    });

    it('shows error for spell check failure', async () => {
      (checkSpelling as jest.Mock).mockResolvedValue({ valid: false });
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      fireEvent.change(screen.getByLabelText(/add a new word/i), { target: { value: 'xyzabc' } });
      await act(async () => {
        fireEvent.submit(screen.getByLabelText(/add a new word/i).closest('form')!);
      });
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Word not found in dictionary');
      });
    });

    it('adds valid new word to pending list', async () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      fireEvent.change(screen.getByLabelText(/add a new word/i), { target: { value: 'newword' } });
      await act(async () => {
        fireEvent.submit(screen.getByLabelText(/add a new word/i).closest('form')!);
      });
      await waitFor(() => {
        expect(screen.getByText('newword')).toBeInTheDocument();
      });
    });

    it('removes pending word when clicking remove button', async () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      fireEvent.change(screen.getByLabelText(/add a new word/i), { target: { value: 'newword' } });
      await act(async () => {
        fireEvent.submit(screen.getByLabelText(/add a new word/i).closest('form')!);
      });
      await waitFor(() => {
        expect(screen.getByText('newword')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole('button', { name: /remove newword/i }));
      expect(screen.queryByText('newword')).not.toBeInTheDocument();
    });

    it('shows error when submitting with no selections', () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      fireEvent.click(screen.getByRole('button', { name: /create list/i }));
      expect(screen.getByRole('alert')).toHaveTextContent('Select or add at least one word');
    });

    it('shows existing words grouped by category', () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      expect(screen.getByText('My Words')).toBeInTheDocument();
      expect(screen.getByText('Year 3/4')).toBeInTheDocument();
      expect(screen.getByText('Year 5/6')).toBeInTheDocument();
    });

    it('selects and deselects words via checkbox', () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      const checkbox = screen.getByRole('checkbox', { name: /apple/i });
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('filters words by search query', () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      fireEvent.change(screen.getByPlaceholderText('Search words...'), { target: { value: 'apple' } });
      expect(screen.getByText('apple')).toBeInTheDocument();
      expect(screen.queryByText('banana')).not.toBeInTheDocument();
    });

    it('shows no results message when search has no matches', () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      fireEvent.change(screen.getByPlaceholderText('Search words...'), { target: { value: 'zzzzz' } });
      expect(screen.getByText('No words match your search')).toBeInTheDocument();
    });

    it('shows selected count in create button', () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      fireEvent.click(screen.getByRole('checkbox', { name: /apple/i }));
      expect(screen.getByRole('button', { name: /create list \(1\)/i })).toBeInTheDocument();
    });

    it('creates list and returns to list view', async () => {
      render(<WordListsContent initialWordSets={[]} initialWords={mockWords} initialAutoWordSet={[]} />);
      fireEvent.click(screen.getByRole('button', { name: /new list/i }));
      fireEvent.click(screen.getByRole('checkbox', { name: /apple/i }));
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /create list/i }));
      });
      expect(screen.queryByText('Add a new word')).not.toBeInTheDocument();
    });
  });

  describe('empty list display', () => {
    it('shows empty list message when word IDs do not resolve', () => {
      const wordSets: WordSet[] = [{ wordSetId: 'ws1', createdAt: 100, wordIds: ['nonexistent'] }];
      render(<WordListsContent initialWordSets={wordSets} initialWords={mockWords} initialAutoWordSet={[]} />);
      expect(screen.getByText('This list is empty.')).toBeInTheDocument();
    });
  });
});
