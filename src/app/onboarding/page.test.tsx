import React from 'react';
import { render } from '@testing-library/react';
import Onboarding from './page';

describe('Onboarding Page', () => {
  it('renders correctly', () => {
    const { container } = render(<Onboarding />);
    expect(container).toMatchSnapshot();
  });
});
