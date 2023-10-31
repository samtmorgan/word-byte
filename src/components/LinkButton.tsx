import Link from 'next/link';
import React from 'react';

export default function LinkButton({ label, href, disabled }: { label: string; href: string; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled} className="button cool-border-with-shadow">
      {/* <span> */}
      <Link href={href}>{label}</Link>
      {/* </span> */}
    </button>
  );
}
