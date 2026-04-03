import { mockCurrentWords } from '../testUtils/mockData';
import { sayTestWord } from './sayTestWord';
import { speak } from './speech';

jest.mock('./speech.ts', () => ({
  speak: jest.fn().mockResolvedValue(undefined),
}));

describe('sayTestWord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a promise', () => {
    const result = sayTestWord(mockCurrentWords, 0);
    expect(result).toBeInstanceOf(Promise);
  });

  it('should call speak if a word can be found at the specified index', async () => {
    await sayTestWord(mockCurrentWords, 1);

    expect(speak).toHaveBeenCalledWith('testWord2');
  });

  it('should not call speak if a word can not be found at the specified index', async () => {
    await sayTestWord([mockCurrentWords[0]], 1);

    expect(speak).not.toHaveBeenCalled();
  });

  it('should not call speak if there are no words', async () => {
    await sayTestWord([], 0);
    expect(speak).not.toHaveBeenCalled();
  });

  it('should not call speak if no words are passed', async () => {
    await sayTestWord(null, 0);
    expect(speak).not.toHaveBeenCalled();
  });

  it('should not call speak if there is no word in the word object', async () => {
    await sayTestWord([{}] as never, 0);
    expect(speak).not.toHaveBeenCalled();
  });
});
