import React from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import NavDrawer from '../navDrawer/NavDrawer';
import styles from './Header.module.css';

const Header = async () => {
  const { userId } = await auth();

  return (
    <header className={styles.header}>
      <div className={styles.headerNav}>
        <NavDrawer isSignedIn={!!userId} />
      </div>
      <div className={styles.headerCenter}>
        <Link href="/" className={styles.appLogo}>
          <Image src="/android-chrome-512x512.png" alt="Word Byte Logo" width={32} height={32} />
          Word Byte
        </Link>
      </div>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default Header;
