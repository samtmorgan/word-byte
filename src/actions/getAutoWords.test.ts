import { getAutoWords } from './getAutoWords';
import { initialiseUser } from './initUser';
import { updateAutoWordSet } from './updateAutoWordSet';
import { initAutoWordSet } from '../utils/wordSelection';
import { filterWordsByYearGroups, DEFAULT_YEAR_GROUPS } from './autoWordUtils';
import { Word, WordOwner, User } from './types';
import { mockUser } from '../testUtils/mockData';

jest.mock('./initUser', () => ({ initialiseUser: jest.fn() }));
jest.mock('./updateAutoWordSet', () => ({ updateAutoWordSet: jest.fn() }));
jest.mock('../utils/wordSelection', () => ({ initAutoWordSet: jest.fn() }));
jest.mock('./autoWordUtils', () => ({
  filterWordsByYearGroups: jest.fn(),
  DEFAULT_YEAR_GROUPS: ['year3_4', 'year5_6'],
}));

describe('getAutoWords', () => {
  const mockWords: Word[] = [
    { wordId: 'w1', word: 'apple', owner: WordOwner.PLATFORM, results: [], yearGroup: 'year3_4' },
    { wordId: 'w2', word: 'banana', owner: WordOwner.PLATFORM, results: [], yearGroup: 'year5_6' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (updateAutoWordSet as jest.Mock).mockResolvedValue(undefined);
  });

  it('should return empty result with default year groups when user is null', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await getAutoWords();

    expect(result).toEqual({ words: [], isEmpty: false, yearGroups: DEFAULT_YEAR_GROUPS });
    expect(updateAutoWordSet).not.toHaveBeenCalled();
  });

  it('should return existing autoWordSet words when user has autoWordSet', async () => {
    const userWithAutoSet: User = {
      ...mockUser,
      words: mockWords,
      autoWordSet: ['w1'],
      autoConfig: { yearGroups: ['year3_4'] },
    };
    (initialiseUser as jest.Mock).mockResolvedValue(userWithAutoSet);
    (filterWordsByYearGroups as jest.Mock).mockReturnValue(mockWords);

    const result = await getAutoWords();

    expect(result.words).toEqual([mockWords[0]]);
    expect(result.isEmpty).toBe(false);
    expect(result.yearGroups).toEqual(['year3_4']);
    expect(updateAutoWordSet).not.toHaveBeenCalled();
  });

  it('should initialise a new auto word set when user has none', async () => {
    const userWithoutAutoSet: User = {
      ...mockUser,
      words: mockWords,
      autoWordSet: [],
      autoConfig: { yearGroups: ['year3_4', 'year5_6'] },
    };
    (initialiseUser as jest.Mock).mockResolvedValue(userWithoutAutoSet);
    (filterWordsByYearGroups as jest.Mock).mockReturnValue(mockWords);
    (initAutoWordSet as jest.Mock).mockReturnValue(mockWords);

    const result = await getAutoWords();

    expect(initAutoWordSet).toHaveBeenCalledWith(mockWords);
    expect(updateAutoWordSet).toHaveBeenCalledWith({
      autoWordSet: mockWords.map(w => w.wordId),
      userPlatformId: mockUser.userPlatformId,
    });
    expect(result.words).toEqual(mockWords);
    expect(result.isEmpty).toBe(false);
  });

  it('should return isEmpty true when initAutoWordSet returns empty', async () => {
    const userWithoutAutoSet: User = {
      ...mockUser,
      words: [],
      autoWordSet: [],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(userWithoutAutoSet);
    (filterWordsByYearGroups as jest.Mock).mockReturnValue([]);
    (initAutoWordSet as jest.Mock).mockReturnValue([]);

    const result = await getAutoWords();

    expect(result).toEqual({ words: [], isEmpty: true, yearGroups: DEFAULT_YEAR_GROUPS });
    expect(updateAutoWordSet).not.toHaveBeenCalled();
  });

  it('should filter out words not found in user words', async () => {
    const userWithStaleAutoSet: User = {
      ...mockUser,
      words: [mockWords[0]],
      autoWordSet: ['w1', 'w-nonexistent'],
    };
    (initialiseUser as jest.Mock).mockResolvedValue(userWithStaleAutoSet);
    (filterWordsByYearGroups as jest.Mock).mockReturnValue([mockWords[0]]);

    const result = await getAutoWords();

    expect(result.words).toEqual([mockWords[0]]);
    expect(result.isEmpty).toBe(false);
  });

  it('should use DEFAULT_YEAR_GROUPS when user has no autoConfig', async () => {
    const userNoConfig: User = {
      ...mockUser,
      words: mockWords,
      autoWordSet: ['w1'],
      autoConfig: undefined,
    };
    (initialiseUser as jest.Mock).mockResolvedValue(userNoConfig);
    (filterWordsByYearGroups as jest.Mock).mockReturnValue(mockWords);

    const result = await getAutoWords();

    expect(result.yearGroups).toEqual(DEFAULT_YEAR_GROUPS);
  });
});
