'use client';

import React from 'react';
import { AppContextProvider } from '../context/AppContext';
import Header from '../components/Header';
import { navOptions } from '../constants/constants';

export default function Main({ children }: { children?: React.ReactNode }) {
  return (
    <AppContextProvider>
      <Header navOptions={navOptions} />
      <main>{children}</main>
    </AppContextProvider>
  );
}
