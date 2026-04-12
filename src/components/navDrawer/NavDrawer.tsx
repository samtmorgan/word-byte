'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PATHS } from '../../constants';
import styles from './NavDrawer.module.css';

interface NavDrawerProps {
  isSignedIn: boolean;
}

export default function NavDrawer({ isSignedIn }: NavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isSignedIn) return null;

  return (
    <>
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

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} aria-hidden="true" />}

      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`} aria-label="Navigation drawer">
        {isOpen && (
          <>
            <button
              type="button"
              className={`${styles.hamburger} ${styles.hamburgerX}`}
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </button>
            <nav className={styles.nav}>
              <Link href={PATHS.ROOT} onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href={PATHS.MY_WORDS} onClick={() => setIsOpen(false)}>
                My Words
              </Link>
              <Link href={PATHS.PROGRESS} onClick={() => setIsOpen(false)}>
                Progress
              </Link>
              <Link href={PATHS.WORD_LISTS} onClick={() => setIsOpen(false)}>
                Word Lists
              </Link>
              <Link href={PATHS.HISTORY} onClick={() => setIsOpen(false)}>
                History
              </Link>
            </nav>
          </>
        )}
      </div>
    </>
  );
}
