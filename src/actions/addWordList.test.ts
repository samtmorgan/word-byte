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

  it('should throw an error if user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    await expect(addWordList(['test'])).rejects.toThrow("couldn't initialise user");
  });

  it('should add new words to the user', async () => {
    const mockUser = {
      words: [{ word: 'existingWord', wordId: 'existing-word-id', owner: WordOwner.USER, results: [] }],
      wordSets: [],
      userPlatformId: 'user1',
    };
    (initialiseUser as jest.Mock).mockResolvedValue(mockUser);
    (uuidv4 as jest.Mock).mockReturnValueOnce('new-word-id').mockReturnValueOnce('new-word-set-id');

    await addWordList(['newWord']);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: [...mockUser.words, { word: 'newWord', wordId: 'new-word-id', owner: WordOwner.USER, results: [] }],
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
    const mockUser = {
      words: [{ word: 'existingWord', wordId: 'existing-word-id', owner: WordOwner.USER, results: [] }],
      wordSets: [],
      userPlatformId: 'user1',
    };
    (initialiseUser as jest.Mock).mockResolvedValue(mockUser);
    (uuidv4 as jest.Mock).mockReturnValueOnce('new-word-set-id');

    await addWordList(['existingWord']);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: mockUser.words,
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
    const mockUser = {
      words: [{ word: 'existingWord', wordId: 'existing-word-id', owner: WordOwner.USER, results: [] }],
      wordSets: [],
      userPlatformId: 'user1',
    };
    (initialiseUser as jest.Mock).mockResolvedValue(mockUser);
    (uuidv4 as jest.Mock).mockReturnValueOnce('new-word-id').mockReturnValueOnce('new-word-set-id');

    await addWordList(['existingWord', 'newWord']);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: [...mockUser.words, { word: 'newWord', wordId: 'new-word-id', owner: WordOwner.USER, results: [] }],
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
