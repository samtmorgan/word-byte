import React from 'react';
import { render, screen } from '@testing-library/react';
import Select from './Select';

describe('Select', () => {
  it('should render the label', () => {
    render(<Select />);
    expect(screen.getByText('Choose a dog name:')).toBeInTheDocument();
  });

  it('should render all dog name options', () => {
    render(<Select />);
    expect(screen.getByRole('option', { name: 'Rigatoni' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dave' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Pumpernickel' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Reeses' })).toBeInTheDocument();
  });

  it('should render the select element', () => {
    render(<Select />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
