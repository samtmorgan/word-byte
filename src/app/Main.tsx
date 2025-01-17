// 'use client';

import React from 'react';
// import { AppContextProvider } from '../context/AppContext';

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    // <AppContextProvider>
    <main>{children}</main>
    // </AppContextProvider>
  );
}
