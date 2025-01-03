'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import axios from 'axios';
import { ContextType, UserType } from '../types/types';
import { composeApiUrl } from '../utils/api';
// import { buildSessionWords } from '../utils/wordUtils';

export const initProviderState = {
  loading: true,
  setLoading: () => {},
  error: false,
  setError: () => {},
  user: null,
  setUser: () => {},
  testWords: [],
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
  const [testWords, setTestWords] = useState<string[]>([]);

  const contextValue = useMemo(
    () => ({
      loading,
      error,
      user,
      setLoading,
      setError,
      setUser,
      testWords,
      setTestWords,
    }),
    [loading, error, user, setLoading, setError, setUser, testWords, setTestWords],
  );

  useEffect(() => {
    const getWords = async () => {
      axios
        .get(composeApiUrl('currentWords'))
        .then(res => {
          const theWords = res.data;
          setTestWords(theWords);
          setLoading(false);
        })
        .catch(e => {
          console.log(e);
          setError(true);
          setLoading(false);
        });
    };
    getWords();
  }, []);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export { AppContext, AppContextProvider, useAppContext };
