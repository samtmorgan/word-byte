'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { mockUser } from '../mockData/user';
import { ContextType, SessionWordType, UserType } from '../types/types';
import { buildSessionWords } from '../utils/wordUtils';

const AppContext = createContext<ContextType>({
  loading: true,
  setLoading: () => {},
  error: false,
  setError: () => {},
  user: null,
  setUser: () => {},
  sessionWords: null,
  setSessionWords: () => {},
});

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
    }),
    [loading, error, user, setLoading, setError, setUser, sessionWords, setSessionWords],
  );

  useEffect(() => {
    setUser(mockUser);
    if (mockUser) {
      const currentWords = buildSessionWords(mockUser.words);
      setSessionWords(currentWords);
    }

    setLoading(false);
  }, []);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export { AppContext, AppContextProvider, useAppContext };
