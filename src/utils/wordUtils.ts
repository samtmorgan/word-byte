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

// export function buildSessionWords(words: UserWordType[]) {
//   const currentWords = words
//     .filter(({ current }) => current)
//     .map(word => ({
//       ...word,
//       correct: false,
//     }));
//   return currentWords;
// }

// export function buildSessionWords(currentWords: string[]): SessionWordType[] {
//   //   const platformCurrent = year3AndYear4StandardWords.filter(word => currentWords.includes(word.uuid));
//   //   const userCurrent = userWords.filter(word => currentWords.includes(word.uuid));
//   //   const sessionWords = [...platformCurrent, ...userCurrent].map(word => ({
//   //     ...word,
//   //     correct: false,
//   //   }));

//   const sessionWords = currentWords.map(currentWord => ({
//     word: currentWord,
//     correct: false,
//     uuid: '123',
//   }));

//   return sessionWords;
// }
