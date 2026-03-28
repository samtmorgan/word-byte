import { getAutoWords } from './getAutoWords';
import { initialiseUser } from './initUser';
import { updateAutoWordSet } from './updateAutoWordSet';
import { buildInitialAutoWordSet, DEFAULT_YEAR_GROUPS } from './autoWordUtils';
import { WordOwner } from './types';

jest.mock('./initUser.ts', () => ({
  initialiseUser: jest.fn(),
}));
jest.mock('./updateAutoWordSet', () => ({
  updateAutoWordSet: jest.fn(),
}));
jest.mock('./autoWordUtils', () => ({
  DEFAULT_YEAR_GROUPS: ['year3_4', 'year5_6'],
  buildInitialAutoWordSet: jest.fn(),
}));

const mockWord = { word: 'test', wordId: 'w1', owner: WordOwner.PLATFORM, results: [], yearGroup: 'year3_4' };

describe('getAutoWords', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns defaults when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await getAutoWords();

    expect(result).toEqual({ words: [], isEmpty: false, yearGroups: DEFAULT_YEAR_GROUPS });
  });

  it('creates new auto word set when empty', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue({
      userPlatformId: 'p1',
      words: [mockWord],
      autoWordSet: [],
      autoConfig: { yearGroups: ['year3_4'], includeUserWords: false },
    });
    (buildInitialAutoWordSet as jest.Mock).mockReturnValue([mockWord]);

    const result = await getAutoWords();

    expect(buildInitialAutoWordSet).toHaveBeenCalledWith([mockWord], ['year3_4'], false);
    expect(updateAutoWordSet).toHaveBeenCalledWith({ autoWordSet: ['w1'], userPlatformId: 'p1' });
    expect(result).toEqual({ words: [mockWord], isEmpty: false, yearGroups: ['year3_4'] });
  });

  it('returns isEmpty true when no words match', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue({
      userPlatformId: 'p1',
      words: [],
      autoWordSet: [],
      autoConfig: { yearGroups: ['year3_4'], includeUserWords: false },
    });
    (buildInitialAutoWordSet as jest.Mock).mockReturnValue([]);

    const result = await getAutoWords();

    expect(result.isEmpty).toBe(true);
    expect(updateAutoWordSet).not.toHaveBeenCalled();
  });

  it('resolves existing auto word set IDs to words', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue({
      userPlatformId: 'p1',
      words: [mockWord],
      autoWordSet: ['w1'],
      autoConfig: { yearGroups: ['year3_4'], includeUserWords: false },
    });

    const result = await getAutoWords();

    expect(result.words).toEqual([mockWord]);
    expect(buildInitialAutoWordSet).not.toHaveBeenCalled();
    expect(updateAutoWordSet).not.toHaveBeenCalled();
  });

  it('uses DEFAULT_YEAR_GROUPS when autoConfig is missing', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue({
      userPlatformId: 'p1',
      words: [mockWord],
      autoWordSet: [],
    });
    (buildInitialAutoWordSet as jest.Mock).mockReturnValue([mockWord]);

    const result = await getAutoWords();

    expect(result.yearGroups).toEqual(DEFAULT_YEAR_GROUPS);
    expect(buildInitialAutoWordSet).toHaveBeenCalledWith([mockWord], DEFAULT_YEAR_GROUPS, false);
  });

  it('filters out unresolved word IDs', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue({
      userPlatformId: 'p1',
      words: [mockWord],
      autoWordSet: ['w1', 'nonexistent'],
      autoConfig: { yearGroups: ['year3_4'], includeUserWords: false },
    });

    const result = await getAutoWords();

    expect(result.words).toEqual([mockWord]);
  });
});
