import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Main from './Main';

describe('Main component', () => {
  describe('Main component', () => {
    it("should render it's children", () => {
      const { getByText } = render(
        <Main>
          <div>MockChild</div>
        </Main>,
      );

      expect(getByText('MockChild')).toBeInTheDocument();
    });

    // it('should match snapshot', () => {
    //   const { asFragment } = render(
    //     <Main>
    //       <div>MockChild</div>
    //     </Main>,
    //   );

    //   expect(asFragment()).toMatchSnapshot();
    // });
  });
});
