'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockUser } from '../mockData/user';
import { ContextType, UserType } from '../types/types';
// import { buildSessionWords } from '../utils/wordUtils';

export const initProviderState = {
  loading: true,
  setLoading: () => {},
  error: false,
  setError: () => {},
  user: null,
  setUser: () => {},
  //   sessionWords: null,
  //   setSessionWords: () => {},
  //   testLifecycle: null,
  //   setTestLifecycle: () => {},
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
  //   const [sessionWords, setSessionWords] = useState<string[] | null>([]);
  //   const [sessionWords, setSessionWords] = useState<string[] | null>(null);
  //   const [testLifecycle, setTestLifecycle] = useState<TestLifecycleType | null>('notStarted');

  const contextValue = useMemo(
    () => ({
      loading,
      error,
      user,
      setLoading,
      setError,
      setUser,
      //   sessionWords,
      //   setSessionWords,
      //   testLifecycle,
      //   setTestLifecycle,
    }),
    [
      loading,
      error,
      user,
      setLoading,
      setError,
      setUser,
      //   sessionWords,
      //   setSessionWords,
      //   testLifecycle,
      //   setTestLifecycle,
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
    }
    setUser(mockUser);
    setLoading(false);
  }, []);

  //   useEffect(() => {
  //     return;
  //     if (!user) return;
  //     if (user.words.wordSets.length > 0) {
  //       const currentWords = buildSessionWords(user.words.wordSets[0]);
  //       setSessionWords(currentWords);
  //       //   setSessionWords(user.words.wordSets[0]);
  //     }
  //     setLoading(false);
  //   }, [user]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export { AppContext, AppContextProvider, useAppContext };
