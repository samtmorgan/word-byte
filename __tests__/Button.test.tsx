// import React from 'react';
import '@testing-library/jest-dom';

function test() {
  return true;
}

describe('Test test', () => {
  it('function should return true', () => {
    const result = test();
    expect(result).toBeTruthy();
  });
});

// describe('test that the button renders the props passed', () => {
//     it('renders a button')
// })
