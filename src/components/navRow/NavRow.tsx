import React from 'react';

interface NavRowProps {
  label: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  prevAriaLabel: string;
  nextAriaLabel: string;
}

const TriangleLeft = () => (
  <svg width="32" height="32" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M11 3L4 8L11 13Z" fill="currentColor" />
  </svg>
);

const TriangleRight = () => (
  <svg width="32" height="32" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M5 3L12 8L5 13Z" fill="currentColor" />
  </svg>
);

export function NavRow({
  label,
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  prevAriaLabel,
  nextAriaLabel,
}: NavRowProps) {
  return (
    <div className="navRow">
      <button type="button" disabled={prevDisabled} onClick={onPrev} aria-label={prevAriaLabel}>
        <TriangleLeft />
      </button>
      <span className="navLabel">{label}</span>
      <button type="button" disabled={nextDisabled} onClick={onNext} aria-label={nextAriaLabel}>
        <TriangleRight />
      </button>
    </div>
  );
}
