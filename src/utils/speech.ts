let currentAudio: HTMLAudioElement | null = null;

export async function speak(word: string): Promise<void> {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  window.speechSynthesis.cancel();

  try {
    const audio = new Audio(`/api/tts/${encodeURIComponent(word.toLowerCase())}`);
    currentAudio = audio;
    await audio.play();
  } catch {
    // Fallback to browser SpeechSynthesis if Azure TTS fails
    const msg = new SpeechSynthesisUtterance();
    msg.text = word;
    window.speechSynthesis.speak(msg);
  }
}
