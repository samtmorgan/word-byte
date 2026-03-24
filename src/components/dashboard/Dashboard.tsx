'use client';

import React, { useState } from 'react';
import { GroupStats } from '../../utils/dashboardStats';
import styles from './Dashboard.module.css';

export default function Dashboard({ groups }: { groups: GroupStats[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (groups.length === 0) return null;

  const active = groups[activeIndex];
  const masteryPct = active.total === 0 ? 0 : Math.round((active.mastered / active.total) * 100);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div className={styles.tabRow}>
        {groups.map((group, i) => (
          <button
            key={group.label}
            type="button"
            className={i === activeIndex ? styles.activeTab : styles.tab}
            onClick={() => setActiveIndex(i)}
          >
            {group.label}
          </button>
        ))}
      </div>
      <div className={styles.statsBlock}>
        <div className={styles.statRow}>
          <span>Mastered</span>
          <span>
            {active.mastered} / {active.total}
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${masteryPct}%` }} />
        </div>
        <div className={styles.statRow}>
          <span>Accuracy</span>
          <span>{active.accuracy}%</span>
        </div>
      </div>
    </div>
  );
}
