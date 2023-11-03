import { useRouter } from 'next/navigation';
import React from 'react';

export default function LinkButton({ label, href, disabled }: { label: string; href: string; disabled?: boolean }) {
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => router.push(href)}
      className="button cool-border-with-shadow"
    >
      {/* <span> */}
      {/* <Link href={href}></Link> */}
      {/* </span> */}
      {label}
    </button>
  );
}
