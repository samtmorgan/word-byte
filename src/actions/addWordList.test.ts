import { v4 as uuidv4 } from 'uuid';
import { addWordList } from './addWordList';
import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { WordOwner } from './types';

jest.mock('./initUser.ts', () => ({
  initialiseUser: jest.fn(),
}));
jest.mock('./updateUserWordsAndWordSets', () => ({
  updateUserWordsAndWordSets: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));
jest.mock('../utils/getTimeStamp', () => ({
  getTimeStamp: jest.fn(() => 123),
}));

describe('addWordList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns INIT_FAILED when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await addWordList(['test']);

    expect(result).toEqual({ success: false, code: 'INIT_FAILED', error: expect.any(String) });
  });

  it('returns VALIDATION_ERROR for empty array', async () => {
    const result = await addWordList([]);

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
    expect(initialiseUser).not.toHaveBeenCalled();
  });

  it('returns VALIDATION_ERROR for array with empty string', async () => {
    const result = await addWordList(['']);

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
    expect(initialiseUser).not.toHaveBeenCalled();
  });

  it('should add new words to the user', async () => {
    const mockUserData = {
      words: [{ word: 'existingWord', wordId: 'existing-word-id', owner: WordOwner.USER, results: [] }],
      wordSets: [],
      userPlatformId: 'user1',
    };
    (initialiseUser as jest.Mock).mockResolvedValue(mockUserData);
    (uuidv4 as jest.Mock).mockReturnValueOnce('new-word-id').mockReturnValueOnce('new-word-set-id');

    const result = await addWordList(['newWord']);

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: [...mockUserData.words, { word: 'newWord', wordId: 'new-word-id', owner: WordOwner.USER, results: [] }],
      wordSets: [
        {
          wordSetId: 'new-word-set-id',
          createdAt: 123,
          wordIds: ['new-word-id'],
        },
      ],
      userPlatformId: 'user1',
    });
  });

  it('should not add duplicate words', async () => {
    const mockUserData = {
      words: [{ word: 'existingWord', wordId: 'existing-word-id', owner: WordOwner.USER, results: [] }],
      wordSets: [],
      userPlatformId: 'user1',
    };
    (initialiseUser as jest.Mock).mockResolvedValue(mockUserData);
    (uuidv4 as jest.Mock).mockReturnValueOnce('new-word-set-id');

    const result = await addWordList(['existingWord']);

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: mockUserData.words,
      wordSets: [
        {
          wordSetId: 'new-word-set-id',
          createdAt: 123,
          wordIds: ['existing-word-id'],
        },
      ],
      userPlatformId: 'user1',
    });
  });

  it('should handle a mix of new and existing words', async () => {
    const mockUserData = {
      words: [{ word: 'existingWord', wordId: 'existing-word-id', owner: WordOwner.USER, results: [] }],
      wordSets: [],
      userPlatformId: 'user1',
    };
    (initialiseUser as jest.Mock).mockResolvedValue(mockUserData);
    (uuidv4 as jest.Mock).mockReturnValueOnce('new-word-id').mockReturnValueOnce('new-word-set-id');

    const result = await addWordList(['existingWord', 'newWord']);

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: [...mockUserData.words, { word: 'newWord', wordId: 'new-word-id', owner: WordOwner.USER, results: [] }],
      wordSets: [
        {
          wordSetId: 'new-word-set-id',
          createdAt: 123,
          wordIds: ['new-word-id', 'existing-word-id'],
        },
      ],
      userPlatformId: 'user1',
    });
  });
});
