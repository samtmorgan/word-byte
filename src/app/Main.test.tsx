import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Main from './Main';

describe("Main component should render it's children", () => {
  it('renders a <nav />', () => {
    const result = render(
      <Main>
        <div>MockChild</div>
      </Main>,
    );

    expect(result).toMatchSnapshot();
  });
});
