'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { User, UserMode, YearGroup } from '../../actions/types';
import { PATHS } from '../../constants';
import { updateUserMode } from '../../actions/updateUserMode';
import { updateAutoConfig } from '../../actions/updateAutoConfig';

export default function WelcomeContent({ user }: { user: User | null }) {
  const [mode, setMode] = useState<UserMode>(user?.mode ?? 'auto');
  const [yearGroups, setYearGroups] = useState<YearGroup[]>(user?.autoConfig?.yearGroups ?? ['year3_4', 'year5_6']);
  const [, startTransition] = useTransition();

  if (!user) {
    return null;
  }

  const handleModeToggle = (newMode: UserMode) => {
    setMode(newMode);
    startTransition(() => {
      updateUserMode({ userPlatformId: user.userPlatformId, mode: newMode });
    });
  };

  const handleYearGroupToggle = (group: YearGroup) => {
    const isSelected = yearGroups.includes(group);
    if (isSelected && yearGroups.length === 1) {
      return;
    }
    const newYearGroups = isSelected ? yearGroups.filter(g => g !== group) : [...yearGroups, group];
    setYearGroups(newYearGroups);
    startTransition(() => {
      updateAutoConfig(newYearGroups);
    });
  };

  return (
    <div className="pageContainer">
      <h1>Hello {user.username} 👋</h1>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={() => handleModeToggle('auto')}
          style={{ backgroundColor: mode === 'auto' ? 'rgb(43, 252, 183)' : undefined }}
        >
          Word Byte Auto
        </button>
        <button
          type="button"
          onClick={() => handleModeToggle('manual')}
          style={{ backgroundColor: mode === 'manual' ? 'rgb(43, 252, 183)' : undefined }}
        >
          Manual
        </button>
      </div>

      {mode === 'auto' && (
        <>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleYearGroupToggle('year3_4')}
              style={{ backgroundColor: yearGroups.includes('year3_4') ? 'rgb(43, 252, 183)' : undefined }}
            >
              Year 3/4
            </button>
            <button
              type="button"
              onClick={() => handleYearGroupToggle('year5_6')}
              style={{ backgroundColor: yearGroups.includes('year5_6') ? 'rgb(43, 252, 183)' : undefined }}
            >
              Year 5/6
            </button>
          </div>
          <Link href={`${PATHS.TEST}?mode=auto`} className="button cool-border-with-shadow">
            ✍️ Start Practice
          </Link>
        </>
      )}

      {mode === 'manual' && (
        <>
          <Link href={PATHS.TEST} className="button cool-border-with-shadow">
            ✍️ Practice Now
          </Link>
          <Link href={PATHS.NEW_WORD_LIST} className="button cool-border-with-shadow">
            ⛮ Make new word list
          </Link>
        </>
      )}
    </div>
  );
}
