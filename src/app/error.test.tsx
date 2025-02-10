import React from 'react';
import { render } from '@testing-library/react';
import Error from './error';

jest.mock('../components', () => ({
  ErrorPage: () => <div>mock error component</div>,
}));

describe('error page', () => {
  it('should return the error component', () => {
    const { container } = render(Error());
    expect(container).toMatchSnapshot();
  });
});
