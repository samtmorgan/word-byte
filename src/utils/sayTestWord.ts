import { Word } from '../actions/types';
import { speak } from './speech';

export async function sayTestWord(words: Word[] | null, index: number): Promise<void> {
  if (!words) return;
  if (index >= words.length) return;
  const { word } = words[index];
  if (word) await speak(word);
}
