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

const VALID_UUID = '00000000-0000-4000-8000-000000000001';
const VALID_UUID_2 = '00000000-0000-4000-8000-000000000002';

describe('deleteUserWord', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns INIT_FAILED when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await deleteUserWord(VALID_UUID);

    expect(result).toEqual({ success: false, code: 'INIT_FAILED', error: expect.any(String) });
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('returns VALIDATION_ERROR for invalid ID', async () => {
    const result = await deleteUserWord('not-a-uuid');

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
    expect(initialiseUser).not.toHaveBeenCalled();
  });

  it('removes the word with matching wordId', async () => {
    const wordToDelete = { word: 'deleteMe', wordId: VALID_UUID, owner: WordOwner.USER, results: [] };
    const keepWord = { word: 'keepMe', wordId: VALID_UUID_2, owner: WordOwner.PLATFORM, results: [] };
    const user = {
      ...mockUser,
      words: [wordToDelete, keepWord],
      wordSets: [{ wordSetId: 'ws1', createdAt: 123, wordIds: [VALID_UUID, VALID_UUID_2] }],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    const result = await deleteUserWord(VALID_UUID);

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: [keepWord],
      wordSets: [{ wordSetId: 'ws1', createdAt: 123, wordIds: [VALID_UUID_2] }],
      userPlatformId: user.userPlatformId,
    });
  });

  it('removes wordId from all wordSets', async () => {
    const wordToDelete = { word: 'deleteMe', wordId: VALID_UUID, owner: WordOwner.USER, results: [] };
    const user = {
      ...mockUser,
      words: [wordToDelete],
      wordSets: [
        { wordSetId: 'ws1', createdAt: 123, wordIds: [VALID_UUID] },
        { wordSetId: 'ws2', createdAt: 456, wordIds: [VALID_UUID, 'other-id'] },
      ],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    const result = await deleteUserWord(VALID_UUID);

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: [],
      wordSets: [
        { wordSetId: 'ws1', createdAt: 123, wordIds: [] },
        { wordSetId: 'ws2', createdAt: 456, wordIds: ['other-id'] },
      ],
      userPlatformId: user.userPlatformId,
    });
  });
});
