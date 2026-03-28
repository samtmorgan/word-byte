import React from 'react';
import { render, screen } from '@testing-library/react';
import Select from './Select';

describe('Select', () => {
  it('renders the label', () => {
    render(<Select />);
    expect(screen.getByText('Choose a dog name:')).toBeInTheDocument();
  });

  it('renders all four options', () => {
    render(<Select />);
    expect(screen.getByRole('option', { name: 'Rigatoni' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dave' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Pumpernickel' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Reeses' })).toBeInTheDocument();
  });

  it('renders a combobox', () => {
    render(<Select />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
