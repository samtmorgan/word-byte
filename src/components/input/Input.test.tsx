import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  const mockOnChange = jest.fn();

  const setup = () => {
    render(<Input value="" onChange={mockOnChange} name="test-input" placeholder="Enter text" label="Test Input" />);
  };

  test('renders input component with label', () => {
    setup();
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  test('renders input with correct placeholder', () => {
    setup();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('calls onChange function when input value changes', () => {
    setup();
    const inputElement = screen.getByLabelText('Test Input');
    fireEvent.change(inputElement, { target: { value: 'new value' } });
    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  test('renders input with correct initial value', () => {
    render(
      <Input
        value="initial value"
        onChange={mockOnChange}
        name="test-input"
        placeholder="Enter text"
        label="Test Input"
      />,
    );
    expect(screen.getByDisplayValue('initial value')).toBeInTheDocument();
  });
});
