import { Word, WordOwner } from '../actions/types';
import { isWordMastered } from './wordSelection';

export interface GroupStats {
  label: string;
  total: number;
  mastered: number;
  accuracy: number; // 0–100
}

export const calculateGroupStats = (words: Word[]): GroupStats => {
  const total = words.length;
  const mastered = words.filter(isWordMastered).length;

  const allResults = words.flatMap(w => w.results);
  const totalAttempts = allResults.length;
  const totalCorrect = allResults.filter(r => r.pass).length;
  const accuracy = totalAttempts === 0 ? 0 : Math.round((totalCorrect / totalAttempts) * 100);

  return { label: '', total, mastered, accuracy };
};

export const buildDashboardStats = (words: Word[]): GroupStats[] => {
  const y34Words = words.filter(w => w.yearGroup === 'year3_4');
  const y56Words = words.filter(w => w.yearGroup === 'year5_6');
  const customWords = words.filter(w => w.owner === WordOwner.USER);

  const groups: GroupStats[] = [
    { ...calculateGroupStats(y34Words), label: 'Y3/4' },
    { ...calculateGroupStats(y56Words), label: 'Y5/6' },
  ];

  if (customWords.length > 0) {
    groups.push({ ...calculateGroupStats(customWords), label: 'My Words' });
  }

  return groups;
};
