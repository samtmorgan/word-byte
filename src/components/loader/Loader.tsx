'use client';

import React, { useRef, useState, useEffect } from 'react';
import styles from './Loader.module.css';

const SQUARE_SIZE = 20;
const GAP = 5;

export function calculateSquareCount(containerWidth: number): number {
  if (containerWidth <= 0) return 0;
  // N squares fit when: N * SQUARE_SIZE + (N - 1) * GAP <= containerWidth
  // Solving: N <= (containerWidth + GAP) / (SQUARE_SIZE + GAP)
  return Math.floor((containerWidth + GAP) / (SQUARE_SIZE + GAP));
}

interface LoaderProps {
  inline?: boolean;
}

export default function Loader({ inline = false }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [squareCount, setSquareCount] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setSquareCount(calculateSquareCount(entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (inline) {
    return (
      <span className={`${styles.loader} ${styles.inline}`} role="status" aria-label="Loading">
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} className={styles.square} style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </span>
    );
  }

  return (
    <div ref={containerRef} className={styles.loader} role="status" aria-label="Loading">
      {Array.from({ length: squareCount }, (_, i) => (
        <span key={i} className={styles.square} style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}
