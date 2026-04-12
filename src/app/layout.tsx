import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import Header from '../components/header/Header';
import { PageTitleHeading } from '../components/pageTitle/PageTitleHeading';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Word byte',
  description: 'An app for spellings practice',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          <PageTitleHeading />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
