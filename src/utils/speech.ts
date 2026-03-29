export async function speak(word: string): Promise<void> {
  try {
    const audio = new Audio(`/api/tts/${encodeURIComponent(word.toLowerCase())}`);
    await audio.play();
  } catch {
    // Fallback to browser SpeechSynthesis if Azure TTS fails
    const msg = new SpeechSynthesisUtterance();
    msg.text = word;
    window.speechSynthesis.speak(msg);
  }
}
