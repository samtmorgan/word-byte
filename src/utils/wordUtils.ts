// import { v4 as uuidv4 } from 'uuid';
import { userWords, year3AndYear4StandardWords } from '../mockData/words';
// import { UserWordType } from '../types/types';

// export function generateWordObject(newWord: string, ownerType: 'platform' | 'user'): UserWordType {
//   return {
//     word: newWord,
//     uuid: uuidv4(),
//     // owner: ownerType,
//     // current: false,
//   };
// }

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

export function buildSessionWords(currentWords: string[]) {
  const platformCurrent = year3AndYear4StandardWords.filter(word => currentWords.includes(word.uuid));
  const userCurrent = userWords.filter(word => currentWords.includes(word.uuid));
  const sessionWords = [...platformCurrent, ...userCurrent].map(word => ({
    ...word,
    correct: false,
  }));

  return sessionWords;
}
