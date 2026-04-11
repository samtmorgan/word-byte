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

  it('renders the app logo image', () => {
    expect(screen.getByAltText('Word Byte Logo')).toBeInTheDocument();
  });

  it('renders the app name', () => {
    expect(screen.getByText('Word Byte')).toBeInTheDocument();
  });

  it('renders the NavDrawer hamburger button when signed in', () => {
    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
  });

  it('renders the SignedIn component', () => {
    expect(screen.getAllByText('Mocked SignedIn').length).toBeGreaterThan(0);
  });

  it('renders the UserButton component when signed in', () => {
    expect(screen.getByText('Mocked UserButton')).toBeInTheDocument();
  });
});
