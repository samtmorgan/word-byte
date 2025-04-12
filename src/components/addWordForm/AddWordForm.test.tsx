import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddWordForm } from './AddWordForm';

describe('AddWordForm', () => {
  const setWordsMock = jest.fn();
  const words = ['example'];

  beforeEach(() => {
    setWordsMock.mockClear();
  });

  test('renders form elements correctly', () => {
    render(<AddWordForm setWords={setWordsMock} words={words} />);
    expect(screen.getByLabelText(/Add new word/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  test('displays required error when input is empty', async () => {
    render(<AddWordForm setWords={setWordsMock} words={words} />);
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Add/i }));
    });
    expect(await screen.findByRole('alert')).toHaveTextContent('Word needs some letters');
  });

  test('displays pattern error when input is invalid', async () => {
    render(<AddWordForm setWords={setWordsMock} words={words} />);
    await act(async () => {
      fireEvent.input(screen.getByLabelText(/Add new word/i), { target: { value: '123' } });
      fireEvent.submit(screen.getByRole('button', { name: /Add/i }));
    });
    expect(await screen.findByRole('alert')).toHaveTextContent('Letters only, only first letter can be uppercase');
  });

  test('displays duplicate error when input is a duplicate', async () => {
    render(<AddWordForm setWords={setWordsMock} words={words} />);
    await act(async () => {
      fireEvent.input(screen.getByLabelText(/Add new word/i), { target: { value: 'example' } });
    });
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Add/i }));
    });
    expect(await screen.findByRole('alert')).toHaveTextContent('Duplicates not allowed');
  });

  test('calls setWords with new word when input is valid', async () => {
    render(<AddWordForm setWords={setWordsMock} words={words} />);
    const input = screen.getByLabelText(/Add new word/i);
    const button = screen.getByRole('button', { name: /Add/i });

    await act(async () => {
      fireEvent.input(input, { target: { value: 'Word' } });
      fireEvent.blur(input);
      fireEvent.click(button);
    });

    expect(button).not.toBeDisabled();
    expect(setWordsMock).toHaveBeenCalledWith([...words, 'Word']);
  });

  test('resets input after successful submission', async () => {
    render(<AddWordForm setWords={setWordsMock} words={words} />);
    const input = screen.getByLabelText(/Add new word/i);

    await act(async () => {
      fireEvent.input(input, { target: { value: 'Word' } });
      fireEvent.blur(input);
      fireEvent.submit(screen.getByRole('button', { name: /Add/i }));
    });

    expect(input).toHaveValue('');
  });
});
