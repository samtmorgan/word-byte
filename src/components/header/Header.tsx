import React from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import NavDrawer from '../navDrawer/NavDrawer';
import styles from './Header.module.css';

const Header = async () => {
  const { userId } = await auth();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <NavDrawer isSignedIn={!!userId} />
      </div>
      <div className={styles.headerCenter}>
        <div className={styles.appLogo}>
          <Image src="/android-chrome-512x512.png" alt="Word Byte Logo" width={32} height={32} />
          Word Byte
        </div>
      </div>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default Header;
