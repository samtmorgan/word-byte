import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavDrawer from './NavDrawer';

describe('NavDrawer', () => {
  it('renders the hamburger button when signed in', () => {
    render(<NavDrawer isSignedIn />);
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
  });

  it('renders nothing when not signed in', () => {
    render(<NavDrawer isSignedIn={false} />);
    expect(screen.queryByRole('button', { name: /open navigation menu/i })).not.toBeInTheDocument();
  });

  it('opens drawer when hamburger is clicked', () => {
    render(<NavDrawer isSignedIn />);
    const hamburger = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeInTheDocument();
  });

  it('closes drawer when close button is clicked', () => {
    render(<NavDrawer isSignedIn />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }));
    expect(screen.queryByRole('button', { name: /close navigation menu/i })).not.toBeInTheDocument();
  });

  it('shows navigation links when open', () => {
    render(<NavDrawer isSignedIn />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /my words/i })).toBeInTheDocument();
  });

  it('Home link has correct href', () => {
    render(<NavDrawer isSignedIn />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
  });

  it('My Words link has correct href', () => {
    render(<NavDrawer isSignedIn />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(screen.getByRole('link', { name: /my words/i })).toHaveAttribute('href', '/my-words');
  });

  it('closes drawer when overlay is clicked', () => {
    render(<NavDrawer isSignedIn />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    const overlay = document.querySelector('[aria-hidden="true"]');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);
    expect(screen.queryByRole('button', { name: /close navigation menu/i })).not.toBeInTheDocument();
  });

  it('shows all four navigation links when open', () => {
    render(<NavDrawer isSignedIn />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /my words/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /progress/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /word lists/i })).toBeInTheDocument();
  });

  it('Progress link has correct href', () => {
    render(<NavDrawer isSignedIn />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(screen.getByRole('link', { name: /progress/i })).toHaveAttribute('href', '/progress');
  });

  it('Word Lists link has correct href', () => {
    render(<NavDrawer isSignedIn />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    expect(screen.getByRole('link', { name: /word lists/i })).toHaveAttribute('href', '/word-lists');
  });

  it('closes drawer when a navigation link is clicked', () => {
    render(<NavDrawer isSignedIn />);
    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));
    fireEvent.click(screen.getByRole('link', { name: /progress/i }));
    expect(screen.queryByRole('button', { name: /close navigation menu/i })).not.toBeInTheDocument();
  });
});
