import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddWordForm } from './AddWordForm';

describe('AddWordForm', () => {
  const handleAddWord = jest.fn();

  beforeEach(() => {
    handleAddWord.mockClear();
  });

  test('renders the form with input and button', () => {
    render(<AddWordForm handleAddWord={handleAddWord} />);
    expect(screen.getByLabelText(/Add new word/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  test('displays required error when input is empty', async () => {
    render(<AddWordForm handleAddWord={handleAddWord} />);
    fireEvent.submit(screen.getByRole('button', { name: /Add/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Word needs some letters');
    expect(handleAddWord).not.toHaveBeenCalled();
  });

  test('displays pattern error when input is invalid', async () => {
    render(<AddWordForm handleAddWord={handleAddWord} />);
    fireEvent.input(screen.getByLabelText(/Add new word/i), { target: { value: '123' } });
    fireEvent.submit(screen.getByRole('button', { name: /Add/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Word must have letters only');
    expect(handleAddWord).not.toHaveBeenCalled();
  });

  test('calls handleAddWord with valid input', async () => {
    render(<AddWordForm handleAddWord={handleAddWord} />);
    await act(async () => {
      fireEvent.input(screen.getByLabelText(/Add new word/i), { target: { value: 'Hello' } });
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Add/i }));
    });

    expect(handleAddWord).toHaveBeenCalledWith('Hello');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
