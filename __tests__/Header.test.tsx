import React from 'react';
import '@testing-library/jest-dom';
import { RenderResult, render, screen } from '@testing-library/react';
import Header from '../src/components/Header';

/**
 * Renders the Header component
 * @returns {RenderResult} the render result
 */
function renderHeader(): RenderResult {
  return render(<Header />);
}

describe('test that the header component renders as expected', () => {
  beforeEach(() => renderHeader());
  it('renders a <header /> element', () => {
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
  it('renders a <nav /> element', () => {
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
  it('renders the correct label for the <a /> element', () => {
    expect(screen.getByText('👾 Word Byte')).toBeInTheDocument();
  });
  it('renders the correct href for the <a /> element', () => {
    expect(screen.getByText('👾 Word Byte')).toHaveAttribute('href', '/');
  });
});
