import { speak } from './speech';

describe('speak', () => {
  const mockPlay = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    global.Audio = jest.fn().mockImplementation(() => ({
      play: mockPlay,
    })) as unknown as typeof Audio;
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

  it('falls back to SpeechSynthesis when Audio fails', async () => {
    const failingPlay = jest.fn().mockRejectedValue(new Error('network error'));
    global.Audio = jest.fn().mockImplementation(() => ({
      play: failingPlay,
    })) as unknown as typeof Audio;

    const mockSpeak = jest.fn();
    Object.defineProperty(window, 'speechSynthesis', {
      value: { speak: mockSpeak },
      writable: true,
    });
    Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
      value: class {
        text = '';
      },
      writable: true,
    });

    await speak('hello');

    expect(mockSpeak).toHaveBeenCalledTimes(1);
    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance.text).toBe('hello');
  });
});
