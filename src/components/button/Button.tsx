import React, { ReactElement } from 'react';
import Link from 'next/link';

export type ButtonProps = {
  label: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'link';
  onClick?: () => void;
  href?: string;
};

const styles = {
  default: 'button cool-border-with-shadow',
  link: 'nav-link',
};

export default function Button({ type = 'button', label, onClick, disabled, href = '/' }: ButtonProps): ReactElement {
  if (type === 'link') {
    return (
      <Link className={styles.link} href={href}>
        {label}
      </Link>
    );
  }

  return (
    <button
      className={styles.default}
      type={type === 'button' ? 'button' : 'submit'}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
