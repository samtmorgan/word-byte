import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { GroupStats } from '../../utils/dashboardStats';

const mockGroups: GroupStats[] = [
  { label: 'All', mastered: 5, total: 10, accuracy: 75 },
  { label: 'Year 3/4', mastered: 3, total: 6, accuracy: 80 },
];

describe('Dashboard', () => {
  it('returns null when groups array is empty', () => {
    const { container } = render(<Dashboard groups={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders first group as active by default', () => {
    render(<Dashboard groups={mockGroups} />);
    expect(screen.getByText('5 / 10')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders tab buttons for all groups', () => {
    render(<Dashboard groups={mockGroups} />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Year 3/4' })).toBeInTheDocument();
  });

  it('switches active tab on click', () => {
    render(<Dashboard groups={mockGroups} />);
    fireEvent.click(screen.getByRole('button', { name: 'Year 3/4' }));
    expect(screen.getByText('3 / 6')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('shows 0% mastery when total is 0', () => {
    const groups: GroupStats[] = [{ label: 'Empty', mastered: 0, total: 0, accuracy: 0 }];
    render(<Dashboard groups={groups} />);
    expect(screen.getByText('0 / 0')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('calculates correct mastery percentage', () => {
    const groups: GroupStats[] = [{ label: 'Test', mastered: 1, total: 3, accuracy: 50 }];
    render(<Dashboard groups={groups} />);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });
});
