import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Header from './Header';

jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div>Mocked SignedIn{children}</div>,
  UserButton: () => <div>Mocked UserButton</div>,
}));

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn().mockResolvedValue({ userId: 'test-user-id' }),
}));

describe('Header component', () => {
  beforeEach(async () => {
    const element = await Header();
    render(element);
  });

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

  it('renders the SignedIn component', () => {
    expect(screen.getAllByText('Mocked SignedIn').length).toBeGreaterThan(0);
  });

  it('renders the UserButton component when signed in', () => {
    expect(screen.getByText('Mocked UserButton')).toBeInTheDocument();
  });
});
