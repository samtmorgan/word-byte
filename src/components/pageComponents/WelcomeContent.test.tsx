import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import WelcomeContent from './WelcomeContent';
import { User } from '../../actions/types';
import { mockUser } from '../../testUtils/mockData';

jest.mock('../../actions/updateUserMode', () => ({
  updateUserMode: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../actions/updateAutoConfig', () => ({
  updateAutoConfig: jest.fn().mockResolvedValue(undefined),
}));

describe('WelcomeContent', () => {
  it('renders null when user is not provided', () => {
    const { container } = render(<WelcomeContent user={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders welcome message when user is provided', () => {
    const user: User = mockUser;
    const { getByText } = render(<WelcomeContent user={user} />);
    expect(getByText('Hello testUser 👋')).toBeInTheDocument();
  });

  it('renders mode toggle buttons', () => {
    const user: User = mockUser;
    const { getByText } = render(<WelcomeContent user={user} />);
    expect(getByText('Word Byte Auto')).toBeInTheDocument();
    expect(getByText('Manual')).toBeInTheDocument();
  });

  it('shows year group chips and Start Practice in auto mode', () => {
    const user: User = { ...mockUser, mode: 'auto' };
    const { getByText } = render(<WelcomeContent user={user} />);
    expect(getByText('Year 3/4')).toBeInTheDocument();
    expect(getByText('Year 5/6')).toBeInTheDocument();
    expect(getByText('✍️ Start Practice')).toBeInTheDocument();
  });

  it('hides year group chips in manual mode', () => {
    const user: User = { ...mockUser, mode: 'manual' };
    const { queryByText } = render(<WelcomeContent user={user} />);
    expect(queryByText('Year 3/4')).toBeNull();
    expect(queryByText('Year 5/6')).toBeNull();
  });

  it('shows Start Practice and Make new word list in manual mode', () => {
    const user: User = { ...mockUser, mode: 'manual' };
    const { getByText } = render(<WelcomeContent user={user} />);
    expect(getByText('✍️ Start Practice')).toBeInTheDocument();
    expect(getByText('⛮ Make new word list')).toBeInTheDocument();
  });

  it('Start Practice link has correct href in auto mode', () => {
    const user: User = { ...mockUser, mode: 'auto' };
    const { getByText } = render(<WelcomeContent user={user} />);
    const link = getByText('✍️ Start Practice');
    expect(link.closest('a')).toHaveAttribute('href', '/test?mode=auto');
  });

  it('toggles from auto to manual mode on button click', () => {
    const user: User = { ...mockUser, mode: 'auto' };
    const { getByText, queryByText } = render(<WelcomeContent user={user} />);
    fireEvent.click(getByText('Manual'));
    expect(queryByText('Year 3/4')).toBeNull();
    expect(getByText('⛮ Make new word list')).toBeInTheDocument();
  });

  it('allows deselecting all year groups and shows error message', () => {
    const user: User = { ...mockUser, mode: 'auto', autoConfig: { yearGroups: ['year3_4'] } };
    const { getByText, queryByText } = render(<WelcomeContent user={user} />);
    const chip = getByText('Year 3/4');
    fireEvent.click(chip);
    expect(getByText('Please select at least one year group to start practice.')).toBeInTheDocument();
    expect(queryByText('✍️ Start Practice')).toBeInTheDocument();
  });

  it('disables Start Practice button when no year groups selected', () => {
    const user: User = { ...mockUser, mode: 'auto', autoConfig: { yearGroups: ['year3_4'] } };
    const { getByText } = render(<WelcomeContent user={user} />);
    fireEvent.click(getByText('Year 3/4'));
    const button = getByText('✍️ Start Practice');
    expect(button.closest('button')).toBeDisabled();
  });
});
