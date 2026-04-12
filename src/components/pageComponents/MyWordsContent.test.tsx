import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import MyWordsContent from './MyWordsContent';
import { addUserWord } from '../../actions/addUserWord';
import { deleteUserWord } from '../../actions/deleteUserWord';
import { checkSpelling } from '../../utils/spellCheck';
import { WordOwner } from '../../actions/types';

jest.mock('../../actions/addUserWord', () => ({
  addUserWord: jest.fn(),
}));
jest.mock('../../actions/deleteUserWord', () => ({
  deleteUserWord: jest.fn(),
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

const mockWords = [
  {
    word: 'hello',
    wordId: 'id1',
    owner: WordOwner.USER,
    results: [
      { created: 1, pass: true },
      { created: 2, pass: false },
    ],
  },
  {
    word: 'world',
    wordId: 'id2',
    owner: WordOwner.USER,
    results: [],
  },
];

describe('MyWordsContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (checkSpelling as jest.Mock).mockResolvedValue({ valid: true });
    (addUserWord as jest.Mock).mockResolvedValue({ success: true, data: undefined });
    (deleteUserWord as jest.Mock).mockResolvedValue({ success: true, data: undefined });
  });

  it('shows empty state when no words', () => {
    render(<MyWordsContent initialWords={[]} />);
    expect(screen.getByText('No custom words yet. Add some above!')).toBeInTheDocument();
  });

  it('renders word list with words', () => {
    render(<MyWordsContent initialWords={mockWords} />);
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
  });

  it('displays success rates correctly', () => {
    render(<MyWordsContent initialWords={mockWords} />);
    expect(screen.getByText('1/2')).toBeInTheDocument();
    expect(screen.getByText('0/0')).toBeInTheDocument();
  });

  it('renders delete button for each word', () => {
    render(<MyWordsContent initialWords={mockWords} />);
    expect(screen.getByRole('button', { name: /delete hello/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete world/i })).toBeInTheDocument();
  });

  it('renders add word form', () => {
    render(<MyWordsContent initialWords={[]} />);
    expect(screen.getByLabelText(/add new word/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^add$/i })).toBeInTheDocument();
  });

  it('shows error when submitting empty word', async () => {
    render(<MyWordsContent initialWords={[]} />);
    fireEvent.submit(screen.getByRole('button', { name: /^add$/i }).closest('form')!);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Word needs some letters');
    });
  });

  it('shows error for invalid word pattern', async () => {
    render(<MyWordsContent initialWords={[]} />);
    fireEvent.change(screen.getByLabelText(/add new word/i), { target: { value: 'hello world' } });
    fireEvent.submit(screen.getByRole('button', { name: /^add$/i }).closest('form')!);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Letters only');
    });
  });

  it('shows duplicate error when word already exists', async () => {
    render(<MyWordsContent initialWords={mockWords} />);
    fireEvent.change(screen.getByLabelText(/add new word/i), { target: { value: 'hello' } });
    fireEvent.submit(screen.getByRole('button', { name: /^add$/i }).closest('form')!);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('You already have this word');
    });
    expect(checkSpelling).not.toHaveBeenCalled();
  });

  it('shows spell check error when word is invalid', async () => {
    (checkSpelling as jest.Mock).mockResolvedValue({ valid: false });
    render(<MyWordsContent initialWords={[]} />);
    fireEvent.change(screen.getByLabelText(/add new word/i), { target: { value: 'xyznotaword' } });
    fireEvent.submit(screen.getByRole('button', { name: /^add$/i }).closest('form')!);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Word not found in dictionary');
    });
  });

  it('opens delete confirmation modal', () => {
    render(<MyWordsContent initialWords={mockWords} />);
    fireEvent.click(screen.getByRole('button', { name: /delete hello/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete 'hello'/i)).toBeInTheDocument();
  });

  it('closes modal on cancel', () => {
    render(<MyWordsContent initialWords={mockWords} />);
    fireEvent.click(screen.getByRole('button', { name: /delete hello/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('deletes word on confirm', async () => {
    render(<MyWordsContent initialWords={mockWords} />);
    fireEvent.click(screen.getByRole('button', { name: /delete hello/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    });
    await waitFor(() => {
      expect(deleteUserWord).toHaveBeenCalledWith('id1');
      expect(screen.queryByText('hello')).not.toBeInTheDocument();
    });
  });

  it('shows server duplicate error from addUserWord', async () => {
    (addUserWord as jest.Mock).mockResolvedValue({ success: false, code: 'DUPLICATE', error: 'Word already exists' });
    render(<MyWordsContent initialWords={[]} />);
    fireEvent.change(screen.getByLabelText(/add new word/i), { target: { value: 'newword' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /^add$/i }).closest('form')!);
    });
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('You already have this word');
    });
  });
});
