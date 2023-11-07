import { ButtonType } from '@/types/types';
import React, { ReactElement } from 'react';

// const style = `
//           outline
//           outline-4
//           outline-black
//           p-2
//           m-1
//           `;

// const style = ``;

export function Button({ type = 'button', label, onClick, disabled }: ButtonType): ReactElement {
  if (type === 'submit') {
    return (
      <button className="button cool-border-with-shadow" type="submit" onClick={onClick} disabled={disabled}>
        {label}
      </button>
    );
  }

  return (
    <button className="button cool-border-with-shadow" type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
