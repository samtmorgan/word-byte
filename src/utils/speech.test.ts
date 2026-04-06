import { speak } from './speech';

class MockUtterance {
  text = '';
}

function createMockAudio(overrides: { playRejects?: boolean; emitError?: boolean } = {}) {
  const listeners: Record<string, (() => void)[]> = {};
  const mockAudio = {
    play: jest.fn(() => {
      if (overrides.playRejects) return Promise.reject(new Error('autoplay blocked'));
      // Simulate audio ending after play starts
      setTimeout(() => {
        if (overrides.emitError) {
          listeners.error?.forEach(fn => fn());
        } else {
          listeners.ended?.forEach(fn => fn());
        }
      }, 0);
      return Promise.resolve();
    }),
    pause: jest.fn(),
    currentTime: 0,
    addEventListener: jest.fn((event: string, handler: () => void) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(handler);
    }),
  };
  return mockAudio;
}

describe('speak', () => {
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'speechSynthesis', {
      value: { cancel: mockCancel, speak: jest.fn() },
      writable: true,
    });
  });

  it('creates an Audio element with the correct TTS API URL and plays it', async () => {
    const mockAudio = createMockAudio();
    global.Audio = jest.fn(() => mockAudio) as unknown as typeof Audio;

    await speak('hello');

    expect(global.Audio).toHaveBeenCalledWith('/api/tts/hello');
    expect(mockAudio.play).toHaveBeenCalledTimes(1);
  });

  it('lowercases the word in the URL', async () => {
    const mockAudio = createMockAudio();
    global.Audio = jest.fn(() => mockAudio) as unknown as typeof Audio;

    await speak('Hello');

    expect(global.Audio).toHaveBeenCalledWith('/api/tts/hello');
  });

  it('cancels browser SpeechSynthesis before speaking', async () => {
    const mockAudio = createMockAudio();
    global.Audio = jest.fn(() => mockAudio) as unknown as typeof Audio;

    await speak('hello');

    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('pauses and resets the previous Audio instance before starting a new one', async () => {
    const mockAudio = createMockAudio();
    global.Audio = jest.fn(() => mockAudio) as unknown as typeof Audio;

    await speak('first');
    await speak('second');

    expect(mockAudio.pause).toHaveBeenCalled();
    expect(global.Audio).toHaveBeenCalledTimes(2);
  });

  it('falls back to SpeechSynthesis when audio fails to play', async () => {
    const mockAudio = createMockAudio({ playRejects: true });
    global.Audio = jest.fn(() => mockAudio) as unknown as typeof Audio;

    const mockSpeechSpeak = jest.fn();
    Object.defineProperty(window, 'speechSynthesis', {
      value: { cancel: mockCancel, speak: mockSpeechSpeak },
      writable: true,
    });
    Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
      value: MockUtterance,
      writable: true,
    });

    await speak('hello');

    expect(mockSpeechSpeak).toHaveBeenCalledTimes(1);
    const utterance = mockSpeechSpeak.mock.calls[0][0];
    expect(utterance.text).toBe('hello');
  });

  it('falls back to SpeechSynthesis when audio emits error event', async () => {
    const mockAudio = createMockAudio({ emitError: true });
    global.Audio = jest.fn(() => mockAudio) as unknown as typeof Audio;

    const mockSpeechSpeak = jest.fn();
    Object.defineProperty(window, 'speechSynthesis', {
      value: { cancel: mockCancel, speak: mockSpeechSpeak },
      writable: true,
    });
    Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
      value: MockUtterance,
      writable: true,
    });

    await speak('hello');

    expect(mockSpeechSpeak).toHaveBeenCalledTimes(1);
  });

  it('does not fall back to SpeechSynthesis when audio plays successfully', async () => {
    const mockAudio = createMockAudio();
    global.Audio = jest.fn(() => mockAudio) as unknown as typeof Audio;

    const mockSpeechSpeak = jest.fn();
    Object.defineProperty(window, 'speechSynthesis', {
      value: { cancel: mockCancel, speak: mockSpeechSpeak },
      writable: true,
    });

    await speak('hello');

    expect(mockSpeechSpeak).not.toHaveBeenCalled();
  });

  it('does not fall back on a superseded call when a newer speak() has started', async () => {
    const mockAudio = createMockAudio({ playRejects: true });
    global.Audio = jest.fn(() => mockAudio) as unknown as typeof Audio;

    const mockSpeechSpeak = jest.fn();
    Object.defineProperty(window, 'speechSynthesis', {
      value: { cancel: mockCancel, speak: mockSpeechSpeak },
      writable: true,
    });
    Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
      value: MockUtterance,
      writable: true,
    });

    // Fire two speak calls without awaiting the first (simulates strict mode double-fire)
    const first = speak('hello');
    const second = speak('hello');
    await first;
    await second;

    // Only the second (latest) call should fall back — not both
    expect(mockSpeechSpeak).toHaveBeenCalledTimes(1);
  });
});
