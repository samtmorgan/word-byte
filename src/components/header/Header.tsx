import React, { ReactElement } from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { PATHS } from '../../constants';
import NavDrawer from '../navDrawer/NavDrawer';
import styles from './Header.module.css';

const Header = (): ReactElement => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <NavDrawer />
      <nav>
        <Link href={PATHS.ROOT}>👾 Word Byte</Link>
      </nav>
    </div>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </header>
);

export default Header;
