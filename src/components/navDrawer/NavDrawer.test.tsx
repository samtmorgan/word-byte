import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavDrawer from './NavDrawer';

jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('NavDrawer', () => {
  it('renders the hamburger button', () => {
    render(<NavDrawer />);
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
  });

  it('opens drawer when hamburger is clicked', () => {
    render(<NavDrawer />);
    const hamburger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument();
  });

  it('closes drawer when close button is clicked', () => {
    render(<NavDrawer />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    expect(screen.queryByRole('button', { name: /close navigation menu/i })).not.toBeInTheDocument();
  });

  it('shows navigation links when open', () => {
    render(<NavDrawer />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /my words/i })).toBeInTheDocument();
  });

  it('Home link has correct href', () => {
    render(<NavDrawer />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
  });

  it('My Words link has correct href', () => {
    render(<NavDrawer />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(screen.getByRole('link', { name: /my words/i })).toHaveAttribute('href', '/my-words');
  });

  it('closes drawer when overlay is clicked', () => {
    render(<NavDrawer />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    const overlay = document.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);
    expect(screen.queryByRole('button', { name: /close navigation menu/i })).not.toBeInTheDocument();
  });
});
