import React, { ReactElement } from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Button from '../button/Button';

const Header = (): ReactElement => (
  <header>
    <nav>
      <Button type="link" label="👾 Word Byte" href="/" />
    </nav>
    {/* @ts-expect-error Server Component */}
    <SignedIn>
      <UserButton />
    </SignedIn>
  </header>
);

export default Header;
