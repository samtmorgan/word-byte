import React from 'react';
import Loading from './loading';

describe('loading page', () => {
  it('should return a loading component', () => {
    const result = Loading();
    expect(result).toEqual(<div>Loading...</div>);
  });
});
