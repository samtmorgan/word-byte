import { deleteUserWord } from './deleteUserWord';
import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { WordOwner } from './types';
import { mockUser } from '../testUtils/mockData';

jest.mock('./initUser.ts', () => ({
  initialiseUser: jest.fn(),
}));
jest.mock('./updateUserWordsAndWordSets', () => ({
  updateUserWordsAndWordSets: jest.fn(),
}));

const VALID_UUID_DELETE = '11111111-1111-1111-1111-111111111111';
const VALID_UUID_KEEP = '22222222-2222-2222-2222-222222222222';
const VALID_UUID_WS = '33333333-3333-3333-3333-333333333333';
const VALID_UUID_WS2 = '44444444-4444-4444-4444-444444444444';

describe('deleteUserWord', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    await expect(deleteUserWord(VALID_UUID_DELETE)).rejects.toThrow("couldn't initialise user");
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('removes the word with matching wordId', async () => {
    const wordToDelete = { word: 'deleteMe', wordId: VALID_UUID_DELETE, owner: WordOwner.USER, results: [] };
    const keepWord = { word: 'keepMe', wordId: VALID_UUID_KEEP, owner: WordOwner.PLATFORM, results: [] };
    const user = {
      ...mockUser,
      words: [wordToDelete, keepWord],
      wordSets: [{ wordSetId: VALID_UUID_WS, createdAt: 123, wordIds: [VALID_UUID_DELETE, VALID_UUID_KEEP] }],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await deleteUserWord(VALID_UUID_DELETE);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: [keepWord],
      wordSets: [{ wordSetId: VALID_UUID_WS, createdAt: 123, wordIds: [VALID_UUID_KEEP] }],
      userPlatformId: user.userPlatformId,
    });
  });

  it('removes wordId from all wordSets', async () => {
    const wordToDelete = { word: 'deleteMe', wordId: VALID_UUID_DELETE, owner: WordOwner.USER, results: [] };
    const user = {
      ...mockUser,
      words: [wordToDelete],
      wordSets: [
        { wordSetId: VALID_UUID_WS, createdAt: 123, wordIds: [VALID_UUID_DELETE] },
        { wordSetId: VALID_UUID_WS2, createdAt: 456, wordIds: [VALID_UUID_DELETE, VALID_UUID_KEEP] },
      ],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await deleteUserWord(VALID_UUID_DELETE);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: [],
      wordSets: [
        { wordSetId: VALID_UUID_WS, createdAt: 123, wordIds: [] },
        { wordSetId: VALID_UUID_WS2, createdAt: 456, wordIds: [VALID_UUID_KEEP] },
      ],
      userPlatformId: user.userPlatformId,
    });
  });
});
