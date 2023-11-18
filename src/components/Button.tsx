import React, { ReactElement, useMemo } from 'react';
import { ButtonType } from '../types/types';

const styles = {
  default: 'button cool-border-with-shadow',
  icon: 'button cool-border-with-shadow icon-button',
};

export function Button({ type = 'button', label, onClick, disabled, iconButton = false }: ButtonType): ReactElement {
  const style = useMemo(() => (iconButton ? styles.icon : styles.default), [iconButton]);

  if (type === 'submit') {
    return (
      <button className={style} type="submit" onClick={onClick} disabled={disabled}>
        {label}
      </button>
    );
  }

  return (
    <button className={style} type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
