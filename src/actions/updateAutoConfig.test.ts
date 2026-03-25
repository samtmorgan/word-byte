import { updateAutoConfig } from './updateAutoConfig';
import { initialiseUser } from './initUser';
import { updateAutoWordSet } from './updateAutoWordSet';
import { initAutoWordSet } from '../utils/wordSelection';
import { filterWordsByYearGroups } from './autoWordUtils';
import { Word, WordOwner } from './types';
import { mockUser } from '../testUtils/mockData';

jest.mock('./initUser', () => ({ initialiseUser: jest.fn() }));
jest.mock('./updateAutoWordSet', () => ({ updateAutoWordSet: jest.fn() }));
jest.mock('../utils/wordSelection', () => ({ initAutoWordSet: jest.fn() }));
jest.mock('./autoWordUtils', () => ({ filterWordsByYearGroups: jest.fn() }));

describe('updateAutoConfig', () => {
  const mockWords: Word[] = [
    { wordId: 'w1', word: 'apple', owner: WordOwner.PLATFORM, results: [], yearGroup: 'year3_4' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (initialiseUser as jest.Mock).mockResolvedValue(mockUser);
    (filterWordsByYearGroups as jest.Mock).mockReturnValue(mockWords);
    (initAutoWordSet as jest.Mock).mockReturnValue(mockWords);
    (updateAutoWordSet as jest.Mock).mockResolvedValue(undefined);
  });

  it('should call initAutoWordSet with filtered words and update auto word set', async () => {
    const config = { yearGroups: ['year3_4' as const], includeUserWords: false };

    await updateAutoConfig(config);

    expect(initialiseUser).toHaveBeenCalled();
    expect(filterWordsByYearGroups).toHaveBeenCalledWith(mockUser.words, config.yearGroups, config.includeUserWords);
    expect(initAutoWordSet).toHaveBeenCalledWith(mockWords);
    expect(updateAutoWordSet).toHaveBeenCalledWith({
      autoWordSet: mockWords.map(w => w.wordId),
      userPlatformId: mockUser.userPlatformId,
      autoConfig: { yearGroups: config.yearGroups, includeUserWords: config.includeUserWords },
    });
  });

  it('should throw when user cannot be initialised', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    await expect(updateAutoConfig({ yearGroups: ['year3_4'], includeUserWords: false })).rejects.toThrow(
      "couldn't initialise user",
    );

    expect(updateAutoWordSet).not.toHaveBeenCalled();
  });
});
