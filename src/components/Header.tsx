import React, { ReactElement } from 'react';
import { Button } from './Button';

export default function Header(): ReactElement {
  return (
    <header>
      <nav>
        <Button type="link" label="👾 Word Byte" href="/" />
        {/* <a className="nav-link" href="/">
          👾 Word Byte
        </a> */}
      </nav>
    </header>
  );
}
