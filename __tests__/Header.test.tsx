import React from 'react';
import '@testing-library/jest-dom';
import { RenderResult, render, screen } from '@testing-library/react';
// import { useRouter } from 'next/router';
import Header from '../src/components/Header';
import { navOptions } from '../src/constants/constants';

// jest.mock('next/router', () => ({
//   useRouter: jest.fn(),
// }));

// TODO - figure out how to mock the useRouter hook

/**
 * Renders the Header component
 * @returns {RenderResult} the render result
 */
function renderHeader(): RenderResult {
  return render(<Header navOptions={navOptions} />);
}

describe('test that the header component renders as expected', () => {
  it('renders a <header /> element', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
  it('renders a <nav /> element', () => {
    renderHeader();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
  it('renders a <ul /> element', () => {
    renderHeader();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
  it('renders a <li /> element for each nav option', () => {
    renderHeader();
    expect(screen.getAllByRole('listitem')).toHaveLength(navOptions.length);
  });
  it('renders an <a /> element for each nav option', () => {
    renderHeader();
    expect(screen.getAllByRole('link')).toHaveLength(navOptions.length);
  });
  it('renders the correct label for each nav option', () => {
    renderHeader();
    navOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });
  it('renders the correct href for each nav option', () => {
    renderHeader();
    navOptions.forEach(option => {
      expect(screen.getByText(option.label)).toHaveAttribute('href', option.href);
    });
  });
});
