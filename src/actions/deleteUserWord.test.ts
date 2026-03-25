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

describe('deleteUserWord', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    await expect(deleteUserWord('some-id')).rejects.toThrow("couldn't initialise user");
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('removes the word with matching wordId', async () => {
    const wordToDelete = { word: 'deleteMe', wordId: 'delete-id', owner: WordOwner.USER, results: [] };
    const keepWord = { word: 'keepMe', wordId: 'keep-id', owner: WordOwner.PLATFORM, results: [] };
    const user = {
      ...mockUser,
      words: [wordToDelete, keepWord],
      wordSets: [{ wordSetId: 'ws1', createdAt: 123, wordIds: ['delete-id', 'keep-id'] }],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await deleteUserWord('delete-id');

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: [keepWord],
      wordSets: [{ wordSetId: 'ws1', createdAt: 123, wordIds: ['keep-id'] }],
      userPlatformId: user.userPlatformId,
    });
  });

  it('removes wordId from all wordSets', async () => {
    const wordToDelete = { word: 'deleteMe', wordId: 'delete-id', owner: WordOwner.USER, results: [] };
    const user = {
      ...mockUser,
      words: [wordToDelete],
      wordSets: [
        { wordSetId: 'ws1', createdAt: 123, wordIds: ['delete-id'] },
        { wordSetId: 'ws2', createdAt: 456, wordIds: ['delete-id', 'other-id'] },
      ],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await deleteUserWord('delete-id');

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
