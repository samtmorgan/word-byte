import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Main from './Main';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Word byte',
  description: 'An app for spellings practice',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Main>{children}</Main>
      </body>
    </html>
  );
}
