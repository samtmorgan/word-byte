import { ButtonType } from '@/app/types/types';
import React, { ReactElement } from 'react';

// const style = `
//           outline
//           outline-4
//           outline-black
//           p-2
//           m-1
//           `;

const style = ``;

export function Button({ type = 'button', label, onClick, disabled }: ButtonType): ReactElement {
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
