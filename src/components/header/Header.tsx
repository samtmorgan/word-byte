import React from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { PATHS } from '../../constants';
import NavDrawer from '../navDrawer/NavDrawer';
import { PageTitleDisplay } from '../pageTitle/PageTitleDisplay';
import styles from './Header.module.css';

const Header = async () => {
  const { userId } = await auth();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <NavDrawer isSignedIn={!!userId} />
        <nav>
          <Link href={PATHS.ROOT}>👾 Word Byte</Link>
        </nav>
      </div>
      <div className={styles.headerCenter}>
        <PageTitleDisplay />
      </div>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default Header;
