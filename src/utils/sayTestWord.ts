import { Word } from '../actions/types';
import { speak } from './speech';

export function sayTestWord(words: Word[] | null, index: number): void {
  if (!words) return;
  if (index >= words.length) return;
  const { word } = words[index];
  if (word) speak(word);
}
