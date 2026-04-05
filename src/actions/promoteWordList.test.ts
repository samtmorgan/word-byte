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

const VALID_UUID_WS1 = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const VALID_UUID_WS2 = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
const VALID_UUID_WS3 = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const VALID_UUID_NONEXISTENT = '00000000-0000-0000-0000-000000000000';

describe('promoteWordList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    await expect(promoteWordList(VALID_UUID_WS1)).rejects.toThrow("couldn't initialise user");
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('moves the target word set to the front', async () => {
    const user = {
      ...mockUser,
      wordSets: [
        { wordSetId: VALID_UUID_WS1, createdAt: 1, wordIds: ['a'] },
        { wordSetId: VALID_UUID_WS2, createdAt: 2, wordIds: ['b'] },
        { wordSetId: VALID_UUID_WS3, createdAt: 3, wordIds: ['c'] },
      ],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await promoteWordList(VALID_UUID_WS3);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: user.words,
      wordSets: [
        { wordSetId: VALID_UUID_WS3, createdAt: 3, wordIds: ['c'] },
        { wordSetId: VALID_UUID_WS1, createdAt: 1, wordIds: ['a'] },
        { wordSetId: VALID_UUID_WS2, createdAt: 2, wordIds: ['b'] },
      ],
      userPlatformId: user.userPlatformId,
    });
  });

  it('silently returns when word set not found', async () => {
    const user = { ...mockUser };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await promoteWordList(VALID_UUID_NONEXISTENT);

    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('handles word set already at front', async () => {
    const user = {
      ...mockUser,
      wordSets: [
        { wordSetId: VALID_UUID_WS1, createdAt: 1, wordIds: ['a'] },
        { wordSetId: VALID_UUID_WS2, createdAt: 2, wordIds: ['b'] },
      ],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await promoteWordList(VALID_UUID_WS1);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: user.words,
      wordSets: [
        { wordSetId: VALID_UUID_WS1, createdAt: 1, wordIds: ['a'] },
        { wordSetId: VALID_UUID_WS2, createdAt: 2, wordIds: ['b'] },
      ],
      userPlatformId: user.userPlatformId,
    });
  });
});
