import { render } from '@testing-library/react';
import React from 'react';
import Loading from './loading';

jest.mock('../components', () => ({
  Loader: () => <div>mock loading component</div>,
}));

describe('loading page', () => {
  it('should return the loading component', () => {
    const { container } = render(Loading());
    expect(container).toMatchSnapshot();
  });
});
