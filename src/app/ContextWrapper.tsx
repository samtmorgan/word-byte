'use client';

import React from 'react';
import { AppContextProvider } from '@/context/AppContext';
import Header from '@/components/Header';

export default function ContextWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AppContextProvider>
      <Header />
      <main>{children}</main>
    </AppContextProvider>
  );
}
