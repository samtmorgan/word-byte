import confetti from 'canvas-confetti';
import React, { useCallback, useEffect, useRef } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getAnimationSettings(originXA: number, originXB: number) {
  return {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    particleCount: 150,
    origin: {
      x: randomInRange(originXA, originXB),
      y: Math.random() - 0.2,
    },
  };
}

export default function Fireworks() {
  const refAnimationInstance = useRef<confetti.CreateTypes | null>(null);

  const getInstance = useCallback((instance: confetti.CreateTypes | null) => {
    refAnimationInstance.current = instance;
  }, []);

  useEffect(() => {
    // Start the animation
    const interval = setInterval(() => {
      if (refAnimationInstance.current) {
        refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
        refAnimationInstance.current(getAnimationSettings(0.3, 0.6));
        refAnimationInstance.current(getAnimationSettings(0.6, 0.9));
      }
    }, 500);

    // Stop the animation after 1 second
    const timeout = setTimeout(() => {
      clearInterval(interval); // Stop the interval
      if (refAnimationInstance.current) {
        refAnimationInstance.current.reset(); // Reset the animation
      }
    }, 20 * 1000);

    // Cleanup function to clear the interval and timeout
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      if (refAnimationInstance.current) {
        refAnimationInstance.current.reset();
      }
    };
  }, []);

  return (
    <ReactCanvasConfetti
      className="fireworks"
      refConfetti={getInstance}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
    />
  );
}
