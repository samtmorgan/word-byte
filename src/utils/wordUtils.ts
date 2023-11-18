import { SessionWordType } from '../types/types';

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

export function buildSessionWords(currentWords: string[]): SessionWordType[] {
  //   const platformCurrent = year3AndYear4StandardWords.filter(word => currentWords.includes(word.uuid));
  //   const userCurrent = userWords.filter(word => currentWords.includes(word.uuid));
  //   const sessionWords = [...platformCurrent, ...userCurrent].map(word => ({
  //     ...word,
  //     correct: false,
  //   }));

  const sessionWords = currentWords.map(currentWord => ({
    word: currentWord,
    correct: false,
  }));

  return sessionWords;
}
