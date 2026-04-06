import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import TestContent from './TestContent';
import { mockCurrentWords } from '../../testUtils/mockData';
import { sayTestWord } from '../../utils/sayTestWord';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));
jest.mock('../../components', () => ({
  Loader: () => <div>mock loading</div>,
  Review: () => <div>mock review</div>,
}));
jest.mock('../modal/Modal', () => ({
  Modal: ({ open, children, actions }: { open: boolean; children: React.ReactNode; actions: React.ReactNode }) =>
    open ? (
      <div>
        {children}
        {actions}
      </div>
    ) : null,
}));
jest.mock('../../utils/sayTestWord', () => ({
  sayTestWord: jest.fn().mockResolvedValue(undefined),
}));

describe('TestContent', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the test controls after speaking completes', async () => {
    render(<TestContent initialWords={mockCurrentWords} isAutoMode={false} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Say word/ })).toBeEnabled();
    });

    expect(screen.getByRole('button', { name: /Check Answers/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Previous/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Next/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Cancel/ })).toBeEnabled();
    expect(screen.getByText(`1 of ${mockCurrentWords.length} words`)).toBeInTheDocument();
  });

  it('should speak automatically on mount', () => {
    render(<TestContent initialWords={mockCurrentWords} isAutoMode={false} />);

    expect(sayTestWord).toHaveBeenCalledWith(mockCurrentWords, 0);
  });

  it('should cycle through the words in the test', async () => {
    const user = userEvent.setup();
    render(<TestContent initialWords={mockCurrentWords} isAutoMode={false} />);

    const previousButton = screen.getByRole('button', { name: /Previous/ });
    const nextButton = screen.getByRole('button', { name: /Next/ });

    expect(screen.getByText(`1 of ${mockCurrentWords.length} words`)).toBeInTheDocument();

    await user.click(nextButton);
    expect(screen.getByText(`2 of ${mockCurrentWords.length} words`)).toBeInTheDocument();

    await user.click(previousButton);
    expect(screen.getByText(`1 of ${mockCurrentWords.length} words`)).toBeInTheDocument();

    await user.click(nextButton);
    expect(screen.getByText(`2 of ${mockCurrentWords.length} words`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled();

    const reviewButton = screen.getByRole('button', { name: /Check Answers/ });
    expect(reviewButton).toBeEnabled();

    await user.click(reviewButton);
    expect(screen.getByText(/mock review/)).toBeInTheDocument();
  });

  it('should call the speak function when the say word button is clicked', async () => {
    const user = userEvent.setup();
    render(<TestContent initialWords={mockCurrentWords} isAutoMode={false} />);

    jest.clearAllMocks();
    (sayTestWord as jest.Mock).mockResolvedValue(undefined);

    const sayWordButton = screen.getByRole('button', { name: /Say word/ });
    await user.click(sayWordButton);

    expect(sayTestWord).toHaveBeenCalled();
  });

  it('should speak automatically when navigating to the next word', async () => {
    const user = userEvent.setup();
    render(<TestContent initialWords={mockCurrentWords} isAutoMode={false} />);

    jest.clearAllMocks();
    (sayTestWord as jest.Mock).mockResolvedValue(undefined);

    await user.click(screen.getByRole('button', { name: /Next/ }));

    expect(sayTestWord).toHaveBeenCalledWith(mockCurrentWords, 1);
  });

  it('should speak automatically when navigating to the previous word', async () => {
    const user = userEvent.setup();
    render(<TestContent initialWords={mockCurrentWords} isAutoMode={false} />);

    await user.click(screen.getByRole('button', { name: /Next/ }));

    jest.clearAllMocks();
    (sayTestWord as jest.Mock).mockResolvedValue(undefined);

    await user.click(screen.getByRole('button', { name: /Previous/ }));

    expect(sayTestWord).toHaveBeenCalledWith(mockCurrentWords, 0);
  });

  it('should open a confirmation modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<TestContent initialWords={mockCurrentWords} isAutoMode={false} />);

    await user.click(screen.getByRole('button', { name: /Cancel/ }));

    expect(screen.getByText(/Are you sure you want to cancel the test\?/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yes, cancel/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Keep going/ })).toBeInTheDocument();
  });

  it('should navigate to home when cancel is confirmed', async () => {
    const user = userEvent.setup();
    render(<TestContent initialWords={mockCurrentWords} isAutoMode={false} />);

    await user.click(screen.getByRole('button', { name: /Cancel/ }));
    await user.click(screen.getByRole('button', { name: /Yes, cancel/ }));

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should close the modal when keep going is clicked', async () => {
    const user = userEvent.setup();
    render(<TestContent initialWords={mockCurrentWords} isAutoMode={false} />);

    await user.click(screen.getByRole('button', { name: /Cancel/ }));
    await user.click(screen.getByRole('button', { name: /Keep going/ }));

    expect(screen.queryByText(/Are you sure you want to cancel the test\?/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
  });
});
