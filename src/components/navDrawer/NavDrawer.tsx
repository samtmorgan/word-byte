'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SignedIn } from '@clerk/nextjs';
import { PATHS } from '../../constants';
import styles from './NavDrawer.module.css';

export default function NavDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SignedIn>
      <button
        type="button"
        className={styles.hamburger}
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`} aria-label="Navigation drawer">
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation menu"
        >
          ❌
        </button>
        <nav className={styles.nav}>
          <Link href={PATHS.ROOT} onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href={PATHS.MY_WORDS} onClick={() => setIsOpen(false)}>
            My Words
          </Link>
        </nav>
      </div>
    </SignedIn>
  );
}
