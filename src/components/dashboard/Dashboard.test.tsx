import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { GroupStats } from '../../utils/dashboardStats';

const mockGroups: GroupStats[] = [
  { label: 'Year 3/4', total: 10, mastered: 5, accuracy: 80 },
  { label: 'Year 5/6', total: 20, mastered: 15, accuracy: 90 },
];

describe('Dashboard', () => {
  it('should return null when groups is empty', () => {
    const { container } = render(<Dashboard groups={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the first group by default', () => {
    render(<Dashboard groups={mockGroups} />);

    expect(screen.getByText('5 / 10')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('should render tab buttons for each group', () => {
    render(<Dashboard groups={mockGroups} />);

    expect(screen.getByRole('button', { name: 'Year 3/4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Year 5/6' })).toBeInTheDocument();
  });

  it('should switch to second group when second tab is clicked', () => {
    render(<Dashboard groups={mockGroups} />);

    fireEvent.click(screen.getByRole('button', { name: 'Year 5/6' }));

    expect(screen.getByText('15 / 20')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('should apply active class to the currently selected tab', () => {
    render(<Dashboard groups={mockGroups} />);

    const firstTab = screen.getByRole('button', { name: 'Year 3/4' });
    const secondTab = screen.getByRole('button', { name: 'Year 5/6' });

    expect(firstTab).toHaveClass('tabActive');
    expect(secondTab).not.toHaveClass('tabActive');

    fireEvent.click(secondTab);

    expect(firstTab).not.toHaveClass('tabActive');
    expect(secondTab).toHaveClass('tabActive');
  });

  it('should display Mastered and Accuracy labels', () => {
    render(<Dashboard groups={mockGroups} />);

    expect(screen.getByText('Mastered')).toBeInTheDocument();
    expect(screen.getByText('Accuracy')).toBeInTheDocument();
  });

  it('should calculate 0% mastery when total is 0', () => {
    const groupsWithZeroTotal: GroupStats[] = [
      { label: 'Empty', total: 0, mastered: 0, accuracy: 0 },
    ];
    render(<Dashboard groups={groupsWithZeroTotal} />);

    expect(screen.getByText('0 / 0')).toBeInTheDocument();
  });
});
