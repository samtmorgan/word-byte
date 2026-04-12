import { v4 as uuidv4 } from 'uuid';
import { addUserWord } from './addUserWord';
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
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('addUserWord', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns init_failed error when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await addUserWord('newword');

    expect(result).toEqual({ success: false, error: 'init_failed' });
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('returns duplicate error when user word already exists (case-insensitive)', async () => {
    const user = {
      ...mockUser,
      words: [{ word: 'mockWord', wordId: 'mockWordId', owner: WordOwner.USER, results: [] }],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    const result = await addUserWord('MOCKWORD');

    expect(result).toEqual({ success: false, error: 'duplicate' });
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('allows adding a word that exists as a platform word', async () => {
    const platformWord = { word: 'fascinate', wordId: 'platform-id', owner: WordOwner.PLATFORM, results: [] };
    const user = { ...mockUser, words: [platformWord], wordSets: [] };
    (initialiseUser as jest.Mock).mockResolvedValue(user);
    (uuidv4 as jest.Mock).mockReturnValue('new-word-id');

    const result = await addUserWord('fascinate');

    expect(result).toEqual({ success: true });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith(
      expect.objectContaining({
        words: [platformWord, { word: 'fascinate', wordId: 'new-word-id', owner: WordOwner.USER, results: [] }],
      }),
    );
  });

  it('successfully adds a new word', async () => {
    const user = { ...mockUser, words: [], wordSets: [] };
    (initialiseUser as jest.Mock).mockResolvedValue(user);
    (uuidv4 as jest.Mock).mockReturnValue('new-word-id');

    const result = await addUserWord('newword');

    expect(result).toEqual({ success: true });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: [{ word: 'newword', wordId: 'new-word-id', owner: WordOwner.USER, results: [] }],
      wordSets: [],
      userPlatformId: user.userPlatformId,
    });
  });

  it('preserves existing words when adding a new one', async () => {
    const existingWord = { word: 'existing', wordId: 'existing-id', owner: WordOwner.PLATFORM, results: [] };
    const user = { ...mockUser, words: [existingWord], wordSets: [] };
    (initialiseUser as jest.Mock).mockResolvedValue(user);
    (uuidv4 as jest.Mock).mockReturnValue('new-word-id');

    await addUserWord('newword');

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith(
      expect.objectContaining({
        words: expect.arrayContaining([existingWord, expect.objectContaining({ word: 'newword' })]),
      }),
    );
  });
});
