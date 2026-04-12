import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import WelcomeContent from './WelcomeContent';
import { User, WordOwner } from '../../actions/types';
import { mockUser } from '../../testUtils/mockData';
import { updateUserMode } from '../../actions/updateUserMode';
import { updateAutoConfig } from '../../actions/updateAutoConfig';

jest.mock('../../actions/updateUserMode', () => ({
  updateUserMode: jest.fn().mockResolvedValue({ success: true, data: undefined }),
}));

jest.mock('../../actions/updateAutoConfig', () => ({
  updateAutoConfig: jest.fn().mockResolvedValue({ success: true, data: undefined }),
}));

jest.mock('../../utils/dashboardStats', () => ({
  buildDashboardStats: jest.fn().mockReturnValue([]),
}));

jest.mock('../dashboard/Dashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard" />,
}));

describe('WelcomeContent', () => {
  it('renders null when user is not provided', () => {
    const { container } = render(<WelcomeContent user={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders mode toggle buttons', () => {
    const user: User = mockUser;
    const { getByText } = render(<WelcomeContent user={user} />);
    expect(getByText('Word Byte Auto')).toBeInTheDocument();
    expect(getByText('Custom')).toBeInTheDocument();
  });

  it('shows year group toggles and Start Practice in auto mode', () => {
    const user: User = { ...mockUser, mode: 'auto' };
    const { getByText } = render(<WelcomeContent user={user} />);
    expect(getByText('Year 3/4')).toBeInTheDocument();
    expect(getByText('Year 5/6')).toBeInTheDocument();
    expect(getByText('✍️ Start Practice')).toBeInTheDocument();
  });

  it('shows My words toggle in auto mode', () => {
    const user: User = { ...mockUser, mode: 'auto' };
    const { getByText } = render(<WelcomeContent user={user} />);
    expect(getByText('My words')).toBeInTheDocument();
  });

  it('disables My words toggle when user has no user words', () => {
    const user: User = { ...mockUser, mode: 'auto' };
    const { getByText } = render(<WelcomeContent user={user} />);
    const label = getByText('My words');
    expect(label.closest('button')).toBeDisabled();
  });

  it('enables My words toggle when user has user words', () => {
    const userWord = { word: 'myword', wordId: 'myWordId', owner: WordOwner.USER, results: [] };
    const user: User = { ...mockUser, mode: 'auto', words: [...mockUser.words, userWord] };
    const { getByText } = render(<WelcomeContent user={user} />);
    const label = getByText('My words');
    expect(label.closest('button')).not.toBeDisabled();
  });

  it('hides year group toggles in manual mode', () => {
    const user: User = { ...mockUser, mode: 'manual' };
    const { queryByText } = render(<WelcomeContent user={user} />);
    expect(queryByText('Year 3/4')).toBeNull();
    expect(queryByText('Year 5/6')).toBeNull();
  });

  it('shows Start Practice in manual mode', () => {
    const user: User = { ...mockUser, mode: 'manual' };
    const { getByText } = render(<WelcomeContent user={user} />);
    expect(getByText('✍️ Start Practice')).toBeInTheDocument();
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
    fireEvent.click(getByText('Custom'));
    expect(queryByText('Year 3/4')).toBeNull();
    expect(getByText('✍️ Start Practice')).toBeInTheDocument();
  });

  it('allows deselecting all year groups and shows error message', () => {
    const user: User = { ...mockUser, mode: 'auto', autoConfig: { yearGroups: ['year3_4'] } };
    const { getByText, queryByText } = render(<WelcomeContent user={user} />);
    fireEvent.click(getByText('Year 3/4'));
    expect(getByText('Please select at least one option.')).toBeInTheDocument();
    expect(queryByText('✍️ Start Practice')).toBeInTheDocument();
  });

  it('marks Start Practice as aria-disabled when no options selected', () => {
    const user: User = { ...mockUser, mode: 'auto', autoConfig: { yearGroups: ['year3_4'] } };
    const { getByText } = render(<WelcomeContent user={user} />);
    fireEvent.click(getByText('Year 3/4'));
    const link = getByText('✍️ Start Practice');
    expect(link.closest('a')).toHaveAttribute('aria-disabled', 'true');
  });

  it('calls updateUserMode when toggling mode', () => {
    const user: User = { ...mockUser, mode: 'auto' };
    const { getByText } = render(<WelcomeContent user={user} />);
    fireEvent.click(getByText('Custom'));
    expect(updateUserMode).toHaveBeenCalledWith({ userPlatformId: user.userPlatformId, mode: 'manual' });
  });

  it('calls updateAutoConfig when toggling year group', () => {
    const user: User = { ...mockUser, mode: 'auto', autoConfig: { yearGroups: ['year3_4', 'year5_6'] } };
    const { getByText } = render(<WelcomeContent user={user} />);
    fireEvent.click(getByText('Year 3/4'));
    expect(updateAutoConfig).toHaveBeenCalledWith({ yearGroups: ['year5_6'], includeUserWords: false });
  });

  it('calls updateAutoConfig when toggling includeUserWords', () => {
    const userWord = { word: 'myword', wordId: 'myWordId', owner: WordOwner.USER, results: [] };
    const user: User = { ...mockUser, mode: 'auto', words: [...mockUser.words, userWord] };
    const { getByText } = render(<WelcomeContent user={user} />);
    fireEvent.click(getByText('My words'));
    expect(updateAutoConfig).toHaveBeenCalledWith({
      yearGroups: ['year3_4', 'year5_6'],
      includeUserWords: true,
    });
  });

  it('marks Start Practice as aria-disabled in manual mode with no word sets', () => {
    const user: User = { ...mockUser, mode: 'manual', wordSets: [] };
    const { getByText } = render(<WelcomeContent user={user} />);
    const link = getByText('✍️ Start Practice');
    expect(link.closest('a')).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows message when no word sets in manual mode', () => {
    const user: User = { ...mockUser, mode: 'manual', wordSets: [] };
    const { getByText } = render(<WelcomeContent user={user} />);
    expect(getByText('Create a word list to start manual practice.')).toBeInTheDocument();
  });

  it('Start Practice link has correct href in manual mode', () => {
    const user: User = { ...mockUser, mode: 'manual' };
    const { getByText } = render(<WelcomeContent user={user} />);
    const link = getByText('✍️ Start Practice');
    expect(link.closest('a')).toHaveAttribute('href', '/test');
  });

  it('renders the Dashboard component', () => {
    const user: User = mockUser;
    const { getByTestId } = render(<WelcomeContent user={user} />);
    expect(getByTestId('dashboard')).toBeInTheDocument();
  });

  it('toggles from manual back to auto mode', () => {
    const user: User = { ...mockUser, mode: 'manual' };
    const { getByText } = render(<WelcomeContent user={user} />);
    fireEvent.click(getByText('Word Byte Auto'));
    expect(updateUserMode).toHaveBeenCalledWith({ userPlatformId: user.userPlatformId, mode: 'auto' });
    expect(getByText('Year 3/4')).toBeInTheDocument();
  });
});
