import React from 'react';
import { render } from '@testing-library/react';
import Error from './Error';

describe('Loader component', () => {
  test('renders loading text', () => {
    const { container } = render(<Error />);

    expect(container).toMatchSnapshot();
  });
});
