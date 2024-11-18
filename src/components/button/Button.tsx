import React, { ReactElement } from 'react';
import Link from 'next/link';

type ButtonProps = {
  label: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'link';
  onClick?: () => void;
  href?: string;
};

const styles = {
  default: 'button cool-border-with-shadow',
  icon: 'button cool-border-with-shadow icon-button',
  link: 'nav-link',
};

export default function Button({ type = 'button', label, onClick, disabled, href = '/' }: ButtonProps): ReactElement {
  if (type === 'submit') {
    return (
      <button className={styles.default} type="submit" onClick={onClick} disabled={disabled}>
        {label}
      </button>
    );
  }

  if (type === 'link') {
    return (
      <Link className={styles.link} href={href}>
        {label}
      </Link>
    );
  }

  return (
    <button className={styles.default} type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
