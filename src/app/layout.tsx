import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Main from './Main';
import Header from '../components/Header';
// import { navOptions } from '../constants/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Word byte',
  description: 'An app for spellings practice',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <Main>{children}</Main>
      </body>
    </html>
  );
}
