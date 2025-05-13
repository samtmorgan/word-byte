import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { WordList } from './WordList';

describe('WordList Component', () => {
  test('renders words correctly', () => {
    const words = ['apple', 'banana', 'cherry'];
    const { getByText } = render(<WordList words={words} setWords={() => {}} />);

    words.forEach(word => {
      expect(getByText(word)).toBeInTheDocument();
    });
  });

  test('calls setWords when delete button is clicked', () => {
    const words = ['apple', 'banana', 'cherry'];
    const setWords = jest.fn();
    const { getAllByRole } = render(<WordList words={words} setWords={setWords} />);

    const buttons = getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(setWords).toHaveBeenCalledWith(['banana', 'cherry']);
  });

  test('does not render delete button if setWords is not provided', () => {
    const words = ['apple', 'banana', 'cherry'];
    const { queryAllByRole } = render(<WordList words={words} />);

    const buttons = queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });
});
