import { speak } from './speech';

describe('speak', () => {
  const mockPlay = jest.fn().mockResolvedValue(undefined);
  const mockPause = jest.fn();
  const mockCancel = jest.fn();
  const mockSpeechSynthesisSpeak = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.Audio = jest.fn().mockImplementation(() => ({
      play: mockPlay,
      pause: mockPause,
      currentTime: 0,
    })) as unknown as typeof Audio;

    Object.defineProperty(window, 'speechSynthesis', {
      value: { cancel: mockCancel, speak: mockSpeechSynthesisSpeak },
      writable: true,
    });
  });

  it('creates an Audio element with the correct TTS API URL and plays it', async () => {
    await speak('hello');

    expect(global.Audio).toHaveBeenCalledWith('/api/tts/hello');
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  it('lowercases the word in the URL', async () => {
    await speak('Hello');

    expect(global.Audio).toHaveBeenCalledWith('/api/tts/hello');
  });

  it('calls speechSynthesis.cancel before playing audio', async () => {
    await speak('hello');

    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('pauses and resets previous audio before playing new audio', async () => {
    const firstAudioInstance = { play: mockPlay, pause: mockPause, currentTime: 0 };
    const secondAudioInstance = { play: mockPlay, pause: jest.fn(), currentTime: 0 };

    let callCount = 0;
    global.Audio = jest.fn().mockImplementation(() => {
      callCount += 1;
      return callCount === 1 ? firstAudioInstance : secondAudioInstance;
    }) as unknown as typeof Audio;

    await speak('hello');
    await speak('world');

    expect(firstAudioInstance.pause).toHaveBeenCalledTimes(1);
    expect(firstAudioInstance.currentTime).toBe(0);
  });

  it('falls back to SpeechSynthesis when Audio fails', async () => {
    const failingPlay = jest.fn().mockRejectedValue(new Error('network error'));
    global.Audio = jest.fn().mockImplementation(() => ({
      play: failingPlay,
      pause: mockPause,
      currentTime: 0,
    })) as unknown as typeof Audio;

    Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
      value: class {
        text = '';
      },
      writable: true,
    });

    await speak('hello');

    expect(mockSpeechSynthesisSpeak).toHaveBeenCalledTimes(1);
    const utterance = mockSpeechSynthesisSpeak.mock.calls[0][0];
    expect(utterance.text).toBe('hello');
  });
});
