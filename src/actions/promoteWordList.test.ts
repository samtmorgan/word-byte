import { promoteWordList } from './promoteWordList';
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
const UUID_3 = '00000000-0000-4000-8000-000000000003';
const UUID_NONEXISTENT = '00000000-0000-4000-8000-000000000099';

describe('promoteWordList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns INIT_FAILED when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await promoteWordList(UUID_1);

    expect(result).toEqual({ success: false, code: 'INIT_FAILED', error: expect.any(String) });
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('returns VALIDATION_ERROR for invalid ID', async () => {
    const result = await promoteWordList('not-a-uuid');

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
    expect(initialiseUser).not.toHaveBeenCalled();
  });

  it('moves the target word set to the front', async () => {
    const user = {
      ...mockUser,
      wordSets: [
        { wordSetId: UUID_1, createdAt: 1, wordIds: ['a'] },
        { wordSetId: UUID_2, createdAt: 2, wordIds: ['b'] },
        { wordSetId: UUID_3, createdAt: 3, wordIds: ['c'] },
      ],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    const result = await promoteWordList(UUID_3);

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: user.words,
      wordSets: [
        { wordSetId: UUID_3, createdAt: 3, wordIds: ['c'] },
        { wordSetId: UUID_1, createdAt: 1, wordIds: ['a'] },
        { wordSetId: UUID_2, createdAt: 2, wordIds: ['b'] },
      ],
      userPlatformId: user.userPlatformId,
    });
  });

  it('silently returns ok when word set not found', async () => {
    const user = { ...mockUser };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    const result = await promoteWordList(UUID_NONEXISTENT);

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('handles word set already at front', async () => {
    const user = {
      ...mockUser,
      wordSets: [
        { wordSetId: UUID_1, createdAt: 1, wordIds: ['a'] },
        { wordSetId: UUID_2, createdAt: 2, wordIds: ['b'] },
      ],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    const result = await promoteWordList(UUID_1);

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: user.words,
      wordSets: [
        { wordSetId: UUID_1, createdAt: 1, wordIds: ['a'] },
        { wordSetId: UUID_2, createdAt: 2, wordIds: ['b'] },
      ],
      userPlatformId: user.userPlatformId,
    });
  });
});
