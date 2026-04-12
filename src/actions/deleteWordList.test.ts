import { deleteWordList } from './deleteWordList';
import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { mockUser } from '../testUtils/mockData';

jest.mock('./initUser.ts', () => ({
  initialiseUser: jest.fn(),
}));
jest.mock('./updateUserWordsAndWordSets', () => ({
  updateUserWordsAndWordSets: jest.fn(),
}));

const UUID_1 = '00000000-0000-4000-8000-000000000001';
const UUID_2 = '00000000-0000-4000-8000-000000000002';
const UUID_NONEXISTENT = '00000000-0000-4000-8000-000000000099';

describe('deleteWordList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns INIT_FAILED when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await deleteWordList(UUID_1);

    expect(result).toEqual({ success: false, code: 'INIT_FAILED', error: expect.any(String) });
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('returns VALIDATION_ERROR for invalid ID', async () => {
    const result = await deleteWordList('not-a-uuid');

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
    expect(initialiseUser).not.toHaveBeenCalled();
  });

  it('removes the correct word set by ID', async () => {
    const user = {
      ...mockUser,
      wordSets: [
        { wordSetId: UUID_1, createdAt: 1, wordIds: ['a'] },
        { wordSetId: UUID_2, createdAt: 2, wordIds: ['b'] },
      ],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    const result = await deleteWordList(UUID_1);

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: user.words,
      wordSets: [{ wordSetId: UUID_2, createdAt: 2, wordIds: ['b'] }],
      userPlatformId: user.userPlatformId,
    });
  });

  it('preserves all word sets when ID does not match', async () => {
    const user = {
      ...mockUser,
      wordSets: [{ wordSetId: UUID_1, createdAt: 1, wordIds: ['a'] }],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    const result = await deleteWordList(UUID_NONEXISTENT);

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: user.words,
      wordSets: user.wordSets,
      userPlatformId: user.userPlatformId,
    });
  });
});
