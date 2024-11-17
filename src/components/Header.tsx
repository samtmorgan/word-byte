import React, { ReactElement } from 'react';
import { Button } from './index';

export default function Header(): ReactElement {
  return (
    <header>
      <nav>
        <Button type="link" label="👾 Word Byte" href="/" />
      </nav>
    </header>
  );
}
