import React, { ReactElement } from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { PATHS } from '../../constants';
import styles from './Header.module.css';

const Header = (): ReactElement => (
  <header className={styles.header}>
    <nav>
      <Link href={PATHS.ROOT}>👾 Word Byte</Link>
    </nav>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </header>
);

export default Header;
