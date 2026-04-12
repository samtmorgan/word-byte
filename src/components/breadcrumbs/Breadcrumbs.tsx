'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { PAGE_TITLES, PATHS } from '../../constants';
import styles from './Breadcrumbs.module.css';

export function Breadcrumbs() {
  const pathname = usePathname();
  const user = useUser();
  const title = PAGE_TITLES[pathname];
  if (!title) return null;

  const greeting = pathname === '/welcome' ? `, hello ${user?.user?.username} 👋` : '';

  return (
    <p className={styles.breadcrumbs}>
      <Link href={PATHS.ROOT} className={styles.homeLink}>
        Home
      </Link>
      &nbsp;/ {title}
      {greeting}
    </p>
  );
}
