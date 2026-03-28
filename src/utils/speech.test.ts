import { speak } from './speech';

class MockSpeechSynthesisUtterance {
  text = '';
}

Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', {
  value: MockSpeechSynthesisUtterance,
  writable: true,
});

describe('speak', () => {
  const mockSpeak = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'speechSynthesis', {
      value: { speak: mockSpeak },
      writable: true,
    });
  });

  it('creates utterance with the given word and calls speechSynthesis.speak', () => {
    speak('hello');

    expect(mockSpeak).toHaveBeenCalledTimes(1);
    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance).toBeInstanceOf(MockSpeechSynthesisUtterance);
    expect(utterance.text).toBe('hello');
  });

  it('works with empty string', () => {
    speak('');

    expect(mockSpeak).toHaveBeenCalledTimes(1);
    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance.text).toBe('');
  });
});
