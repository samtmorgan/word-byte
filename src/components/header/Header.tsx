import React, { ReactElement } from 'react';
import Button from '../button/Button';

const Header = (): ReactElement => (
  <header>
    <nav>
      <Button type="link" label="👾 Word Byte" href="/" />
    </nav>
  </header>
);

export default Header;
