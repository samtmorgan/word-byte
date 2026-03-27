'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { PAGE_TITLES } from '../../constants';
import styles from './PageTitleDisplay.module.css';

export function PageTitleDisplay() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname];
  if (!title) return null;
  return <h1 className={styles.desktopTitle}>{title}</h1>;
}
