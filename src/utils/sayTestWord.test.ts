import { mockCurrentWords } from '../testUtils/mockData';
import { sayTestWord } from './sayTestWord';
import { speak } from './speech';

jest.mock('./speech.ts', () => ({
  speak: jest.fn(),
}));

describe('sayTestWord', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call speak if a word can be found at the specified index', () => {
    sayTestWord(mockCurrentWords, 1);

    expect(speak).toHaveBeenCalledWith('testWord2');
  });

  it('should not call speak if a word can not be found at the specified index', () => {
    sayTestWord([mockCurrentWords[0]], 1);

    expect(speak).not.toHaveBeenCalled();
  });

  it('should not call speak if there are no words', () => {
    sayTestWord([], 0);
    expect(speak).not.toHaveBeenCalled();
  });

  it('should not call speak if no words are passed', () => {
    sayTestWord(null, 0);
    expect(speak).not.toHaveBeenCalled();
  });

  it('should not call speak if there is no word in the word object', () => {
    sayTestWord([{}] as never, 0);
    expect(speak).not.toHaveBeenCalled();
  });
});
