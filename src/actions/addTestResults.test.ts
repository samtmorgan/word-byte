import { mapResultsToUserWords } from '../utils/mapResultsToUserWords';
import { addTestResults } from './addTestResults';
import { initialiseUser } from './initUser';
import { WordOwner, LocalResults } from './types';
import { updateUserWords } from './updateUserWords';

jest.mock('./updateUserWords.ts', () => ({
  updateUserWords: jest.fn(),
}));
jest.mock('./initUser.ts', () => ({
  initialiseUser: jest.fn(),
}));
jest.mock('../utils/mapResultsToUserWords.ts', () => ({
  mapResultsToUserWords: jest.fn(),
}));
jest.mock('./updateAutoWordSet.ts', () => ({
  updateAutoWordSet: jest.fn(),
}));
jest.mock('../utils/wordSelection.ts', () => ({
  refreshAutoWordSet: jest.fn(),
}));

const WORD_UUID_1 = '00000000-0000-4000-8000-000000000001';
const WORD_UUID_2 = '00000000-0000-4000-8000-000000000002';

const validLocalResults: LocalResults = [
  { word: 'testWord1', wordId: WORD_UUID_1, pass: true },
  { word: 'testWord2', wordId: WORD_UUID_2, pass: null },
];

describe('addTestResults', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call functions as expected', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue({
      userPlatformId: 'platform123',
      words: [],
    });
    (mapResultsToUserWords as jest.Mock).mockReturnValue([
      {
        word: 'testWord1',
        wordId: WORD_UUID_1,
        owner: WordOwner.PLATFORM,
        results: [{ created: 123, pass: true }],
      },
    ]);

    const result = await addTestResults({ localResults: validLocalResults });

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWords).toHaveBeenCalledWith({
      words: [
        {
          word: 'testWord1',
          wordId: WORD_UUID_1,
          owner: WordOwner.PLATFORM,
          results: [{ created: 123, pass: true }],
        },
      ],
      userPlatformId: 'platform123',
    });
    expect(initialiseUser).toHaveBeenCalled();
    expect(mapResultsToUserWords).toHaveBeenCalledWith({
      localResults: validLocalResults,
      userWords: [],
    });
  });

  it('returns INIT_FAILED when initialiseUser returns null', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await addTestResults({ localResults: validLocalResults });

    expect(result).toEqual({ success: false, code: 'INIT_FAILED', error: expect.any(String) });
    expect(updateUserWords).not.toHaveBeenCalled();
    expect(mapResultsToUserWords).not.toHaveBeenCalled();
  });

  it('returns VALIDATION_ERROR for empty results', async () => {
    const result = await addTestResults({ localResults: [] });

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
    expect(initialiseUser).not.toHaveBeenCalled();
  });

  it('returns VALIDATION_ERROR for empty wordId', async () => {
    const result = await addTestResults({
      localResults: [{ pass: true, wordId: '', word: 'test' }],
    });

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
    expect(initialiseUser).not.toHaveBeenCalled();
  });
});
