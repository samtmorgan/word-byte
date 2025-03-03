'use client';

import React, { createContext } from 'react';
import { User } from '../actions/types';

type UserContextType = User | null;

const UserContext = createContext<UserContextType>(null);

function UserProvider({ user, children }: { user: User | null; children: React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export { UserContext, UserProvider };
