import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Main from '../src/app/Main';

// function test() {
//   return true;
// }

// describe('Test test', () => {
//   it('function should return true', () => {
//     const result = test();
//     expect(result).toBeTruthy();
//   });
// });

describe('test that the navigation element is rendered', () => {
  it('renders a <nav />', () => {
    render(<Main />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
