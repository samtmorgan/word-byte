import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader, { calculateSquareCount } from './Loader';

describe('calculateSquareCount', () => {
  test('returns 0 for width <= 0', () => {
    expect(calculateSquareCount(0)).toBe(0);
    expect(calculateSquareCount(-10)).toBe(0);
  });

  test('returns 1 for width of 25px', () => {
    expect(calculateSquareCount(25)).toBe(1);
  });

  test('returns 2 for width of 45px', () => {
    expect(calculateSquareCount(45)).toBe(2);
  });

  test('returns 14 for width of 368px', () => {
    expect(calculateSquareCount(368)).toBe(14);
  });
});

describe('Loader component', () => {
  test('renders a div with role="status" by default', () => {
    render(<Loader />);
    const loader = screen.getByRole('status');
    expect(loader).toBeInTheDocument();
    expect(loader.tagName).toBe('DIV');
  });

  test('has aria-label="Loading"', () => {
    render(<Loader />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  test('renders a span with 3 squares when inline={true}', () => {
    render(<Loader inline />);
    const loader = screen.getByRole('status');
    expect(loader.tagName).toBe('SPAN');
    const squares = loader.querySelectorAll('span');
    expect(squares).toHaveLength(3);
  });
});
