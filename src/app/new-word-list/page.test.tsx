import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import NewWordList from './page';
import { addWordList } from '../../actions/addWordList';

jest.mock('../../actions/addWordList', () => ({
  addWordList: jest.fn(),
}));

jest.mock('react-modal', () => {
  const MockModal = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null;
  MockModal.setAppElement = jest.fn();
  return MockModal;
});

jest.mock('next/link', () => {
  const MockLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
  return MockLink;
});

describe('NewWordList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page heading', () => {
    render(<NewWordList />);
    expect(screen.getByText('New word list')).toBeInTheDocument();
  });

  it('should render the Add word list button as disabled when no words', () => {
    render(<NewWordList />);
    expect(screen.getByRole('button', { name: 'Add word list' })).toBeDisabled();
  });

  it('should show saving modal and call addWordList on submit', async () => {
    (addWordList as jest.Mock).mockResolvedValue(undefined);
    render(<NewWordList />);

    await act(async () => {
      fireEvent.input(screen.getByLabelText(/Add new word/i), { target: { value: 'apple' } });
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^Add$/ }));
    });

    const addListButton = screen.getByRole('button', { name: 'Add word list' });
    expect(addListButton).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(addListButton);
    });

    expect(addWordList).toHaveBeenCalledWith(['apple']);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});
