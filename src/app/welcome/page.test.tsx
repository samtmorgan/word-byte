import React from 'react';
import { render } from '@testing-library/react';
import Welcome from './page';

describe('Welcome Page', () => {
  it('renders correctly', () => {
    const { container } = render(<Welcome />);
    expect(container).toMatchSnapshot();
  });
});
