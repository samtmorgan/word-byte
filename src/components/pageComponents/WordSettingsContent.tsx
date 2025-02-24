'use client';

import React from 'react';
import { User } from '../../actions/types';

export const WordSettingsContent = ({ user }: { user: User | null }) => <pre>{JSON.stringify(user, null, 2)}</pre>;
