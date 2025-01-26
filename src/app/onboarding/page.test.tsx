import React, { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Onboarding from './page';

describe('Onboarding Page', () => {
  it('renders correctly', () => {
    const { container } = render(<Onboarding />);
    expect(container).toMatchSnapshot();
  });

  it('updates state correctly', async () => {
    render(<Onboarding />);

    const input = screen.getByRole('textbox');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'new value' } });
    });

    expect(input).toHaveValue('new value');
  });

  it('render a button', () => {
    render(<Onboarding />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
