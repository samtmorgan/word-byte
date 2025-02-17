export function speak(word: string): void {
  const msg = new SpeechSynthesisUtterance();
  msg.text = word;
  window.speechSynthesis.speak(msg);
}
