import { speak } from './speech';

describe('speak', () => {
  const mockPlay = jest.fn().mockResolvedValue(undefined);
  const mockPause = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.Audio = jest.fn().mockImplementation(() => ({
      play: mockPlay,
      pause: mockPause,
      currentTime: 0,
    })) as unknown as typeof Audio;
    Object.defineProperty(window, 'speechSynthesis', {
      value: { cancel: mockCancel, speak: jest.fn() },
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

  it('cancels browser SpeechSynthesis before speaking', async () => {
    await speak('hello');

    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('pauses and resets the previous Audio instance before starting a new one', async () => {
    await speak('first');
    await speak('second');

    // mockPause is called at least once (pausing 'first' audio before 'second' plays)
    expect(mockPause).toHaveBeenCalled();
    expect(global.Audio).toHaveBeenCalledTimes(2);
  });

  it('falls back to SpeechSynthesis when Audio fails', async () => {
    const failingPlay = jest.fn().mockRejectedValue(new Error('network error'));
    global.Audio = jest.fn().mockImplementation(() => ({
      play: failingPlay,
      pause: mockPause,
      currentTime: 0,
    })) as unknown as typeof Audio;

    const mockSpeak = jest.fn();
    Object.defineProperty(window, 'speechSynthesis', {
      value: { cancel: mockCancel, speak: mockSpeak },
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
