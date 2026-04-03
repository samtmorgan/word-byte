'use client';

import React, { useState } from 'react';
import { Word } from '../../actions/types';
import { buildTestHistory, TestSession } from '../../utils/buildTestHistory';
import styles from './HistoryContent.module.css';

interface HistoryContentProps {
  initialWords: Word[];
}

function getWeekBounds(weekOffset: number): { start: number; end: number; label: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ...
  const daysFromMonday = (dayOfWeek + 6) % 7;

  const monday = new Date(now);
  monday.setDate(now.getDate() - daysFromMonday + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  return {
    start: monday.getTime(),
    end: sunday.getTime(),
    label: `${fmt(monday)} – ${fmt(sunday)}`,
  };
}

function formatDay(ts: number): string {
  return new Date(ts).toLocaleDateString('en-GB', { weekday: 'short' });
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function HistoryContent({ initialWords }: HistoryContentProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const allSessions: TestSession[] = buildTestHistory(initialWords);

  const { start, end, label } = getWeekBounds(weekOffset);

  const weekSessions = allSessions.filter(s => s.timestamp >= start && s.timestamp <= end);

  return (
    <div className="pageContainer">
      <div className={styles.navRow}>
        <button type="button" onClick={() => setWeekOffset(o => o - 1)} aria-label="Previous week">
          ◀
        </button>
        <span className={styles.weekLabel}>{label}</span>
        <button
          type="button"
          onClick={() => setWeekOffset(o => o + 1)}
          disabled={weekOffset === 0}
          aria-label="Next week"
        >
          ▶
        </button>
      </div>

      {weekSessions.length === 0 ? (
        <p className={styles.emptyMessage}>No tests this week</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Words</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {weekSessions.map(session => (
              <tr key={session.timestamp}>
                <td>{formatDay(session.timestamp)}</td>
                <td>{formatDate(session.timestamp)}</td>
                <td className={styles.words}>{session.words.map(w => w.word).join(', ')}</td>
                <td>{`${session.score}/${session.total}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
