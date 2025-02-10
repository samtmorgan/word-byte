import { v4 as uuidv4 } from 'uuid';
import { UserWordType } from '../types/types';

export function generateWordObject(newWord: string, ownerType: 'platform' | 'user'): UserWordType {
  return {
    word: newWord,
    uuid: uuidv4(),
    owner: ownerType,
  };
}

export const generateWordList = (words: string[], ownerType: 'platform' | 'user'): UserWordType[] =>
  words.map(word => generateWordObject(word, ownerType));

export function speak(word: string) {
  const msg = new SpeechSynthesisUtterance();
  msg.text = word;
  window.speechSynthesis.speak(msg);
}
