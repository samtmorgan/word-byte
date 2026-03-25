import { getUserWords } from './getUserWords';
import { initialiseUser } from './initUser';
import { WordOwner } from './types';
import { mockUser } from '../testUtils/mockData';

jest.mock('./initUser.ts', () => ({
  initialiseUser: jest.fn(),
}));

describe('getUserWords', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty array when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);
    const result = await getUserWords();
    expect(result).toEqual([]);
  });

  it('returns only user-owned words', async () => {
    const userWord = { word: 'myword', wordId: 'myWordId', owner: WordOwner.USER, results: [] };
    const user = { ...mockUser, words: [...mockUser.words, userWord] };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    const result = await getUserWords();

    expect(result).toEqual([userWord]);
    expect(result.every(w => w.owner === WordOwner.USER)).toBe(true);
  });

  it('returns empty array when user has no user-owned words', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(mockUser);
    const result = await getUserWords();
    expect(result).toEqual([]);
  });
});
