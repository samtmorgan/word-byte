import React from 'react';
import { render } from '@testing-library/react';
import WelcomeContent from './WelcomeContent';
import { User } from '../../actions/types';
import { mockUser } from '../../testUtils/mockData';

describe('WelcomeContent', () => {
  it('renders null when user is not provided', () => {
    const { container } = render(<WelcomeContent user={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders welcome message and button when user is provided', () => {
    const user: User = mockUser;
    const { getByText } = render(<WelcomeContent user={user} />);

    expect(getByText('Hello testUser 👋')).toBeInTheDocument();
    expect(getByText('✍️ Practice Now')).toBeInTheDocument();
  });

  it('renders the button with correct href', () => {
    const user: User = mockUser;
    const { getByText } = render(<WelcomeContent user={user} />);
    const button = getByText('✍️ Practice Now');

    expect(button.closest('a')).toHaveAttribute('href', '/test');
  });
});
