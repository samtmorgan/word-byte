/* eslint-disable no-undef */
import confetti from 'canvas-confetti';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const getInstance = useCallback((instance: confetti.CreateTypes | null) => {
    refAnimationInstance.current = instance;
  }, []);

  const nextTickAnimation = useCallback(() => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
      refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
    }
  }, []);

  const startAnimation = useCallback(() => {
    if (!intervalId) {
      setIntervalId(setInterval(nextTickAnimation, 500));
    }
  }, [intervalId, nextTickAnimation]);

  //   const pauseAnimation = useCallback(() => {
  //     clearInterval(intervalId);
  //     setIntervalId(null);
  //   }, [intervalId]);

  //   const stopAnimation = useCallback(() => {
  //     clearInterval(intervalId);
  //     setIntervalId(null);
  //     refAnimationInstance.current && refAnimationInstance.current.reset();
  //   }, [intervalId]);

  //   useEffect(() => {
  //     clearInterval(intervalId);
  //   }, [intervalId]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

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
