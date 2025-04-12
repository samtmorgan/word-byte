import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader component', () => {
  test('renders loading text', () => {
    render(<Loader />);
    const loadingElement = screen.getByText(/Loading.../i);
    expect(loadingElement).toBeInTheDocument();
  });
});
