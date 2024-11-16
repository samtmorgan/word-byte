import React, { ReactElement } from 'react';

export default function Header(): ReactElement {
  return (
    <header>
      <nav>
        <a className="nav-link" href="/">
          👾 Word Byte
        </a>
      </nav>
    </header>
  );
}
