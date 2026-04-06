let currentAudio: HTMLAudioElement | null = null;
let speakGeneration = 0;

export async function speak(word: string): Promise<void> {
  speakGeneration += 1;
  const thisGeneration = speakGeneration;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  window.speechSynthesis.cancel();

  const audio = new Audio(`/api/tts/${encodeURIComponent(word.toLowerCase())}`);
  currentAudio = audio;

  try {
    await new Promise<void>((resolve, reject) => {
      audio.addEventListener('ended', () => resolve(), { once: true });
      audio.addEventListener('error', () => reject(new Error('audio failed')), { once: true });
      audio.play().catch(reject);
    });
  } catch {
    if (thisGeneration !== speakGeneration) return;
    const msg = new SpeechSynthesisUtterance();
    msg.text = word;
    window.speechSynthesis.speak(msg);
  }
}
