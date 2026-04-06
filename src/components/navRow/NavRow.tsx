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

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
        <ChevronLeft />
      </button>
      <span className="navLabel">{label}</span>
      <button type="button" disabled={nextDisabled} onClick={onNext} aria-label={nextAriaLabel}>
        <ChevronRight />
      </button>
    </div>
  );
}
