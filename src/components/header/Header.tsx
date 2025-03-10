import React, { ReactElement } from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { PATHS } from '../../constants';

const Header = (): ReactElement => (
  <header>
    <nav>
      <Link href={PATHS.ROOT}>👾 Word Byte</Link>
    </nav>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </header>
);

export default Header;
