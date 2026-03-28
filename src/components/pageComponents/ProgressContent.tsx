'use client';

import React, { useState } from 'react';
import { Word, WordOwner } from '../../actions/types';
import { getWordProgress } from '../../utils/progressStats';
import styles from './ProgressContent.module.css';

interface ProgressContentProps {
  initialWords: Word[];
}

interface WordGroup {
  label: string;
  words: Word[];
}

export default function ProgressContent({ initialWords }: ProgressContentProps) {
  const [viewIndex, setViewIndex] = useState(0);

  const allGroups: WordGroup[] = [
    { label: 'Year 3/4', words: initialWords.filter(w => w.yearGroup === 'year3_4') },
    { label: 'Year 5/6', words: initialWords.filter(w => w.yearGroup === 'year5_6') },
    { label: 'My Words', words: initialWords.filter(w => w.owner === WordOwner.USER) },
  ].filter(g => g.words.length > 0);

  if (allGroups.length === 0) {
    return (
      <div className="pageContainer">
        <p className={styles.emptyMessage}>No words yet.</p>
      </div>
    );
  }

  const currentGroup = allGroups[viewIndex];

  return (
    <div className="pageContainer">
      <div className={styles.navRow}>
        <button
          type="button"
          onClick={() => setViewIndex(v => v - 1)}
          disabled={viewIndex === 0}
          aria-label="Previous group"
        >
          ◀
        </button>
        <span className={styles.groupLabel}>{currentGroup.label}</span>
        <button
          type="button"
          onClick={() => setViewIndex(v => v + 1)}
          disabled={viewIndex === allGroups.length - 1}
          aria-label="Next group"
        >
          ▶
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Word</th>
            <th>Attempts</th>
            <th>Passes</th>
            <th>Fails</th>
            <th>Streak</th>
            <th>Success %</th>
          </tr>
        </thead>
        <tbody>
          {currentGroup.words.map(word => {
            const { attempts, passes, fails, successRate, recentStreak } = getWordProgress(word);
            return (
              <tr key={word.wordId}>
                <td>{word.word}</td>
                <td>{attempts}</td>
                <td>{passes}</td>
                <td>{fails}</td>
                <td className={styles.streak}>
                  {recentStreak.map((pass, i) => (
                    <span key={i}>{pass ? '✅' : '❌'}</span>
                  ))}
                </td>
                <td>{successRate === null ? '–' : `${successRate}%`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
