import React from 'react';
import '@testing-library/jest-dom';
import { RenderResult, render, screen } from '@testing-library/react';
import Header from './Header';

/**
 * Renders the Header component
 * @returns {RenderResult} the render result
 */
function renderHeader(): RenderResult {
  return render(<Header />);
}

jest.mock('../button/Button', () => () => <a href="/">👾 Word Byte</a>);

describe('Header component', () => {
  beforeEach(() => renderHeader());

  it('renders a <header /> element', () => {
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('renders a <nav /> element', () => {
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders a <a /> tag', () => {
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders the correct label for the link', () => {
    expect(screen.getByText('👾 Word Byte')).toBeInTheDocument();
  });

  it('renders the correct href for the link', () => {
    expect(screen.getByText('👾 Word Byte')).toHaveAttribute('href', '/');
  });
});