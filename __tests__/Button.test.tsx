/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/Button';

function test() {
  return true;
}

describe('Test test', () => {
  it('function should return true', () => {
    const result = test();
    expect(result).toBeTruthy();
  });
});

describe('test that the button renders the props passed', () => {
  it('renders a button', () => {
    render(<Button label="test label" onClick={() => console.log('onSubmit')} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
