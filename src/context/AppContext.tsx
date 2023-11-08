'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockUser } from '../mockData/user';
import { ContextType, SessionWordType, TestLifecycleType, UserType } from '../types/types';
import { buildSessionWords } from '../utils/wordUtils';

export const initProviderState = {
  loading: true,
  setLoading: () => {},
  error: false,
  setError: () => {},
  user: null,
  setUser: () => {},
  sessionWords: null,
  setSessionWords: () => {},
  testLifecycle: null,
  setTestLifecycle: () => {},
};

const AppContext = createContext<ContextType>(initProviderState);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext was used outside of its Provider');
  }
  return context;
};

function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>(null);
  const [sessionWords, setSessionWords] = useState<SessionWordType[] | null>(null);
  const [testLifecycle, setTestLifecycle] = useState<TestLifecycleType | null>('notStarted');

  const contextValue = useMemo(
    () => ({
      loading,
      error,
      user,
      setLoading,
      setError,
      setUser,
      sessionWords,
      setSessionWords,
      testLifecycle,
      setTestLifecycle,
    }),
    [
      loading,
      error,
      user,
      setLoading,
      setError,
      setUser,
      sessionWords,
      setSessionWords,
      testLifecycle,
      setTestLifecycle,
    ],
  );

  //   useEffect(() => {
  //     setUser(mockUser);
  //     if (mockUser) {
  //       const currentWords = buildSessionWords(mockUser.words);
  //       setSessionWords(currentWords);
  //     }

  //     setLoading(false);
  //   }, []);

  useEffect(() => {
    if (!mockUser) {
      setError(true);
      setLoading(false);
    } else if (mockUser.words.current && mockUser.words.current.length > 0) {
      const currentWords = buildSessionWords(mockUser.words.current);
      setSessionWords(currentWords);
      setLoading(false);
    }
    setUser(mockUser);
    setLoading(false);
  }, []);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export { AppContext, AppContextProvider, useAppContext };
