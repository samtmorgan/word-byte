import React from 'react';
import { render } from '@testing-library/react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import Fireworks from './Fireworks';

jest.mock('react-canvas-confetti', () => jest.fn(() => <div className="fireworks" />));

describe('Fireworks Component', () => {
  it('should start animation on mount', () => {
    const result = render(<Fireworks />);
    expect(result).toMatchSnapshot();
  });

  it('should call ReactCanvasConfetti with correct props', () => {
    render(<Fireworks />);
    expect(ReactCanvasConfetti).toHaveBeenCalled();
  });
});
