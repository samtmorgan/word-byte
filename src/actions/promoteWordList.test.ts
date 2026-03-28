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

describe('promoteWordList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    await expect(promoteWordList('ws-1')).rejects.toThrow("couldn't initialise user");
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('moves the target word set to the front', async () => {
    const user = {
      ...mockUser,
      wordSets: [
        { wordSetId: 'ws-1', createdAt: 1, wordIds: ['a'] },
        { wordSetId: 'ws-2', createdAt: 2, wordIds: ['b'] },
        { wordSetId: 'ws-3', createdAt: 3, wordIds: ['c'] },
      ],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await promoteWordList('ws-3');

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: user.words,
      wordSets: [
        { wordSetId: 'ws-3', createdAt: 3, wordIds: ['c'] },
        { wordSetId: 'ws-1', createdAt: 1, wordIds: ['a'] },
        { wordSetId: 'ws-2', createdAt: 2, wordIds: ['b'] },
      ],
      userPlatformId: user.userPlatformId,
    });
  });

  it('silently returns when word set not found', async () => {
    const user = { ...mockUser };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await promoteWordList('nonexistent');

    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('handles word set already at front', async () => {
    const user = {
      ...mockUser,
      wordSets: [
        { wordSetId: 'ws-1', createdAt: 1, wordIds: ['a'] },
        { wordSetId: 'ws-2', createdAt: 2, wordIds: ['b'] },
      ],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await promoteWordList('ws-1');

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: user.words,
      wordSets: [
        { wordSetId: 'ws-1', createdAt: 1, wordIds: ['a'] },
        { wordSetId: 'ws-2', createdAt: 2, wordIds: ['b'] },
      ],
      userPlatformId: user.userPlatformId,
    });
  });
});
