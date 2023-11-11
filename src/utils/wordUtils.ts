import { UserWordType } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';

export function generateWordObject(newWord: string, ownerType: 'platform' | 'user'): UserWordType {
  return {
    word: newWord,
    uuid: uuidv4(),
    owner: ownerType,
    current: true,
  };
}

export function generateWordList(words: string[], ownerType: 'platform' | 'user'): UserWordType[] {
  return words.map(word => generateWordObject(word, ownerType));
}

export function speak(word: string) {
  const msg = new SpeechSynthesisUtterance();
  msg.text = word;
  window.speechSynthesis.speak(msg);
}

export function buildSessionWords(words: UserWordType[]) {
  const currentWords = words
    .filter(({ current }) => current)
    .map(word => ({
      ...word,
      correct: false,
    }));
  return currentWords;
}
