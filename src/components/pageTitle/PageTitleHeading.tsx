'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { PAGE_TITLES } from '../../constants';
import styles from './PageTitleHeading.module.css';

export function PageTitleHeading() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname];
  if (!title) return null;
  return <h1 className={styles.mobileHeading}>{title}</h1>;
}
