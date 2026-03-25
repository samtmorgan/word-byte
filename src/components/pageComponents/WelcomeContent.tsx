'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { User, UserMode, YearGroup, WordOwner } from '../../actions/types';
import { PATHS } from '../../constants';
import { updateUserMode } from '../../actions/updateUserMode';
import { updateAutoConfig } from '../../actions/updateAutoConfig';
import { buildDashboardStats } from '../../utils/dashboardStats';
import Dashboard from '../dashboard/Dashboard';
import styles from './WelcomeContent.module.css';

export default function WelcomeContent({ user }: { user: User | null }) {
  const [mode, setMode] = useState<UserMode>(user?.mode ?? 'auto');
  const [yearGroups, setYearGroups] = useState<YearGroup[]>(user?.autoConfig?.yearGroups ?? ['year3_4', 'year5_6']);
  const [includeUserWords, setIncludeUserWords] = useState<boolean>(user?.autoConfig?.includeUserWords ?? false);
  const [, startTransition] = useTransition();

  if (!user) {
    return null;
  }

  const year3And4Count = user.words.filter(w => w.yearGroup === 'year3_4').length;
  const year5And6Count = user.words.filter(w => w.yearGroup === 'year5_6').length;
  const userWordCount = user.words.filter(w => w.owner === WordOwner.USER).length;

  const handleModeToggle = (newMode: UserMode) => {
    setMode(newMode);
    startTransition(() => {
      updateUserMode({ userPlatformId: user.userPlatformId, mode: newMode });
    });
  };

  const handleYearGroupToggle = (group: YearGroup) => {
    const isSelected = yearGroups.includes(group);
    const newYearGroups = isSelected ? yearGroups.filter(g => g !== group) : [...yearGroups, group];
    setYearGroups(newYearGroups);
    startTransition(() => {
      updateAutoConfig({ yearGroups: newYearGroups, includeUserWords });
    });
  };

  const handleIncludeUserWordsToggle = () => {
    const newValue = !includeUserWords;
    setIncludeUserWords(newValue);
    startTransition(() => {
      updateAutoConfig({ yearGroups, includeUserWords: newValue });
    });
  };

  const canStart = yearGroups.length > 0 || includeUserWords;
  const groups = buildDashboardStats(user.words);

  return (
    <div className="pageContainer">
      <h1>Hello {user.username} 👋</h1>

      <div className="tabs">
        <h2>Practice time 🚀</h2>
        <div className="tabList">
          <button type="button" className={mode === 'auto' ? 'tabActive' : ''} onClick={() => handleModeToggle('auto')}>
            Word Byte Auto
          </button>
          <button
            type="button"
            className={mode === 'manual' ? 'tabActive' : ''}
            onClick={() => handleModeToggle('manual')}
          >
            Manual
          </button>
        </div>

        <div className="tabPanel">
          {mode === 'auto' && (
            <>
              <div className={styles.toggleList}>
                <button type="button" className={styles.toggleRow} onClick={() => handleYearGroupToggle('year3_4')}>
                  <div
                    className={`${styles.toggleTrack} ${yearGroups.includes('year3_4') ? styles.toggleTrackOn : ''}`}
                  >
                    <div className={styles.toggleNub} />
                  </div>
                  <span className={styles.toggleLabel}>Year 3/4</span>
                  <span>({year3And4Count})</span>
                </button>
                <button type="button" className={styles.toggleRow} onClick={() => handleYearGroupToggle('year5_6')}>
                  <div
                    className={`${styles.toggleTrack} ${yearGroups.includes('year5_6') ? styles.toggleTrackOn : ''}`}
                  >
                    <div className={styles.toggleNub} />
                  </div>
                  <span className={styles.toggleLabel}>Year 5/6</span>
                  <span>({year5And6Count})</span>
                </button>
                <button
                  type="button"
                  className={`${styles.toggleRow} ${userWordCount === 0 ? styles.toggleRowDisabled : ''}`}
                  onClick={userWordCount > 0 ? handleIncludeUserWordsToggle : undefined}
                  disabled={userWordCount === 0}
                >
                  <div className={`${styles.toggleTrack} ${includeUserWords ? styles.toggleTrackOn : ''}`}>
                    <div className={styles.toggleNub} />
                  </div>
                  <span className={styles.toggleLabel}>My words</span>
                  <span>({userWordCount})</span>
                </button>
              </div>
              <Link
                href={`${PATHS.TEST}?mode=auto`}
                className="button cool-border-with-shadow"
                aria-disabled={!canStart}
                onClick={!canStart ? e => e.preventDefault() : undefined}
                style={!canStart ? { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } : undefined}
              >
                ✍️ Start Practice
              </Link>
              {!canStart && <p>Please select at least one option to start practice.</p>}
            </>
          )}

          {mode === 'manual' && (
            <>
              <Link href={PATHS.TEST} className="button cool-border-with-shadow">
                ✍️ Start Practice
              </Link>
              <Link href={PATHS.NEW_WORD_LIST} className="button cool-border-with-shadow">
                ⛮ Make new word list
              </Link>
            </>
          )}
        </div>

        <h2>Your stats 🤘</h2>
        <Dashboard groups={groups} />
      </div>
    </div>
  );
}
