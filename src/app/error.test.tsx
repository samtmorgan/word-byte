import React from 'react';
import Error from './error';

describe('error page', () => {
  it('should return a loading component', () => {
    const result = Error();
    expect(result).toEqual(<div>Sorry, something went wrong.</div>);
  });
});
