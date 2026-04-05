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

const VALID_UUID_WS1 = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const VALID_UUID_WS2 = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const VALID_UUID_NONEXISTENT = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

describe('deleteWordList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    await expect(deleteWordList(VALID_UUID_WS1)).rejects.toThrow("couldn't initialise user");
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('removes the correct word set by ID', async () => {
    const user = {
      ...mockUser,
      wordSets: [
        { wordSetId: VALID_UUID_WS1, createdAt: 1, wordIds: ['a'] },
        { wordSetId: VALID_UUID_WS2, createdAt: 2, wordIds: ['b'] },
      ],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await deleteWordList(VALID_UUID_WS1);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: user.words,
      wordSets: [{ wordSetId: VALID_UUID_WS2, createdAt: 2, wordIds: ['b'] }],
      userPlatformId: user.userPlatformId,
    });
  });

  it('preserves all word sets when ID does not match', async () => {
    const user = {
      ...mockUser,
      wordSets: [{ wordSetId: VALID_UUID_WS1, createdAt: 1, wordIds: ['a'] }],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await deleteWordList(VALID_UUID_NONEXISTENT);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: user.words,
      wordSets: user.wordSets,
      userPlatformId: user.userPlatformId,
    });
  });
});
