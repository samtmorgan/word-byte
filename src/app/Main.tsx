import React from 'react';
import { PageTitleHeading } from '../components/pageTitle/PageTitleHeading';

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <PageTitleHeading />
      {children}
    </main>
  );
}
