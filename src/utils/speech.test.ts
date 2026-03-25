import { speak } from './speech';

describe('speak', () => {
  let mockSpeak: jest.Mock;
  let mockUtterance: { text: string };

  beforeEach(() => {
    mockSpeak = jest.fn();
    mockUtterance = { text: '' };
    global.SpeechSynthesisUtterance = jest.fn(() => mockUtterance) as any;
    global.window = {
      ...global.window,
      speechSynthesis: { speak: mockSpeak } as any,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set the text on the utterance and call speechSynthesis.speak', () => {
    speak('hello');

    expect(global.SpeechSynthesisUtterance).toHaveBeenCalled();
    expect(mockUtterance.text).toBe('hello');
    expect(mockSpeak).toHaveBeenCalledWith(mockUtterance);
  });

  it('should speak an empty string', () => {
    speak('');

    expect(mockUtterance.text).toBe('');
    expect(mockSpeak).toHaveBeenCalled();
  });
});
