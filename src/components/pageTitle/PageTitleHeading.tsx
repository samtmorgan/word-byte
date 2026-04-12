'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { PAGE_TITLES } from '../../constants';
import styles from './PageTitleHeading.module.css';

export function PageTitleHeading() {
  const pathname = usePathname();
  const user = useUser();
  const title = PAGE_TITLES[pathname];
  if (!title) return null;

  if (pathname === '/welcome') {
    return <p className={styles.pageTitleHeading}>{`/ ${title}, hello ${user?.user?.username} 👋`}</p>;
  }

  return <p className={styles.pageTitleHeading}>/ {title}</p>;
}
