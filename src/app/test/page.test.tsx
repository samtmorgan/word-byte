import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TestWordsPage from './page';
import { getCurrentWords } from '../../actions/getCurrentWords';
import { getAutoWords } from '../../actions/getAutoWords';
import { mockCurrentWords } from '../../testUtils/mockData';

jest.mock('../../actions/getCurrentWords', () => ({
  getCurrentWords: jest.fn(),
}));
jest.mock('../../actions/getAutoWords', () => ({
  getAutoWords: jest.fn(),
}));
jest.mock('../../components', () => ({
  ErrorPage: () => <div>mock error</div>,
}));
jest.mock('../../components/pageComponents/TestContent', () => ({
  __esModule: true,
  default: ({ initialWords, isAutoMode }: { initialWords: unknown[]; isAutoMode: boolean }) => (
    <div data-testid="test-content" data-auto-mode={isAutoMode} data-word-count={initialWords.length} />
  ),
}));

describe('TestWordsPage', () => {
  it('should render error component when getCurrentWords throws', async () => {
    (getCurrentWords as jest.Mock).mockRejectedValue(new Error('fail'));

    const page = await TestWordsPage({ searchParams: Promise.resolve({}) });
    render(page);

    expect(screen.getByText('mock error')).toBeInTheDocument();
  });

  it('should render empty message when manual mode returns no words', async () => {
    (getCurrentWords as jest.Mock).mockResolvedValue([]);

    const page = await TestWordsPage({ searchParams: Promise.resolve({}) });
    render(page);

    expect(screen.getByText(/No words here yet/)).toBeInTheDocument();
  });

  it('should render empty message when manual mode returns null', async () => {
    (getCurrentWords as jest.Mock).mockResolvedValue(null);

    const page = await TestWordsPage({ searchParams: Promise.resolve({}) });
    render(page);

    expect(screen.getByText(/No words here yet/)).toBeInTheDocument();
  });

  it('should render TestContent with words in manual mode', async () => {
    (getCurrentWords as jest.Mock).mockResolvedValue(mockCurrentWords);

    const page = await TestWordsPage({ searchParams: Promise.resolve({}) });
    render(page);

    const content = screen.getByTestId('test-content');
    expect(content).toHaveAttribute('data-auto-mode', 'false');
    expect(content).toHaveAttribute('data-word-count', '2');
  });

  it('should render all-correct message when auto mode returns empty set', async () => {
    (getAutoWords as jest.Mock).mockResolvedValue({ words: [], isEmpty: true, yearGroups: [] });

    const page = await TestWordsPage({ searchParams: Promise.resolve({ mode: 'auto' }) });
    render(page);

    expect(screen.getByText(/Amazing! You got all words correct!/)).toBeInTheDocument();
  });

  it('should render TestContent with words in auto mode', async () => {
    (getAutoWords as jest.Mock).mockResolvedValue({ words: mockCurrentWords, isEmpty: false, yearGroups: [] });

    const page = await TestWordsPage({ searchParams: Promise.resolve({ mode: 'auto' }) });
    render(page);

    const content = screen.getByTestId('test-content');
    expect(content).toHaveAttribute('data-auto-mode', 'true');
    expect(content).toHaveAttribute('data-word-count', '2');
  });

  it('should render error component when auto mode throws', async () => {
    (getAutoWords as jest.Mock).mockRejectedValue(new Error('fail'));

    const page = await TestWordsPage({ searchParams: Promise.resolve({ mode: 'auto' }) });
    render(page);

    expect(screen.getByText('mock error')).toBeInTheDocument();
  });
});
