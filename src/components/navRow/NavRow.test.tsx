import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavRow } from './NavRow';

describe('NavRow', () => {
  const defaultProps = {
    label: 'Page 1 of 5',
    onPrev: jest.fn(),
    onNext: jest.fn(),
    prevAriaLabel: 'Previous page',
    nextAriaLabel: 'Next page',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the label', () => {
    render(<NavRow {...defaultProps} />);
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
  });

  it('renders prev and next buttons with aria labels', () => {
    render(<NavRow {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });

  it('calls onPrev when previous button is clicked', () => {
    render(<NavRow {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(defaultProps.onPrev).toHaveBeenCalledTimes(1);
  });

  it('calls onNext when next button is clicked', () => {
    render(<NavRow {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1);
  });

  it('disables previous button when prevDisabled is true', () => {
    render(<NavRow {...defaultProps} prevDisabled />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('disables next button when nextDisabled is true', () => {
    render(<NavRow {...defaultProps} nextDisabled />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('renders SVG chevrons in buttons', () => {
    render(<NavRow {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].querySelector('svg')).toBeInTheDocument();
    expect(buttons[1].querySelector('svg')).toBeInTheDocument();
  });

  it('accepts ReactNode as label', () => {
    render(<NavRow {...defaultProps} label={<strong>Bold label</strong>} />);
    expect(screen.getByText('Bold label')).toBeInTheDocument();
  });
});
