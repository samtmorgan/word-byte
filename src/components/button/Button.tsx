import React, { ReactElement, useMemo } from 'react';
import Link from 'next/link';

export type ButtonProps = {
  label: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'link';
  iconButton?: boolean;
  onClick?: () => void;
  href?: string;
};

const styles = {
  default: 'button cool-border-with-shadow',
  icon: 'button cool-border-with-shadow icon-button',
  link: 'nav-link',
};

export function Button({
  type = 'button',
  label,
  onClick,
  disabled,
  iconButton = false,
  href = '/',
}: ButtonProps): ReactElement {
  const style = useMemo(() => {
    if (iconButton) {
      return styles.icon;
    }

    if (type === 'link') {
      return styles.link;
    }

    return styles.default;
  }, [iconButton, type]);

  if (type === 'submit') {
    return (
      <button className={style} type="submit" onClick={onClick} disabled={disabled}>
        {label}
      </button>
    );
  }

  if (type === 'link') {
    return (
      <Link className="nav-link" href={href}>
        {label}
      </Link>
    );
  }

  return (
    <button className={style} type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
