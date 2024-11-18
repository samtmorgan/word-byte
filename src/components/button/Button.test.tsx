import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button component', () => {
  it('should render the given label', () => {
    render(<Button label="test label" />);
    expect(screen.getByText('test label')).toBeInTheDocument();
  });

  describe('When type is not passed', () => {
    it('renders a button', () => {
      render(<Button label="test label" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('When type is passed as link', () => {
    it('renders a link', () => {
      render(<Button label="test label" type="link" />);
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });

  describe('When type is passed as submit', () => {
    it('renders a button with a type property of submit', () => {
      render(<Button label="test label" type="submit" />);
      expect(screen.getByRole('button')).toHaveProperty('type', 'submit');
    });
  });
});
