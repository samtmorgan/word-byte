import { updateAutoConfig } from './updateAutoConfig';
import { initialiseUser } from './initUser';
import { updateAutoWordSet } from './updateAutoWordSet';
import { buildInitialAutoWordSet } from './autoWordUtils';
import { mockUser } from '../testUtils/mockData';
import { WordOwner } from './types';

jest.mock('./initUser.ts', () => ({
  initialiseUser: jest.fn(),
}));
jest.mock('./updateAutoWordSet', () => ({
  updateAutoWordSet: jest.fn(),
}));
jest.mock('./autoWordUtils', () => ({
  buildInitialAutoWordSet: jest.fn(),
}));

describe('updateAutoConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    await expect(updateAutoConfig({ yearGroups: ['year3_4'], includeUserWords: false })).rejects.toThrow(
      "couldn't initialise user",
    );
    expect(updateAutoWordSet).not.toHaveBeenCalled();
  });

  it('rebuilds auto word set with new config', async () => {
    const mockWords = [{ word: 'test', wordId: 'w1', owner: WordOwner.PLATFORM, results: [], yearGroup: 'year3_4' }];
    (initialiseUser as jest.Mock).mockResolvedValue({ ...mockUser, words: mockWords });
    (buildInitialAutoWordSet as jest.Mock).mockReturnValue(mockWords);

    await updateAutoConfig({ yearGroups: ['year3_4'], includeUserWords: true });

    expect(buildInitialAutoWordSet).toHaveBeenCalledWith(mockWords, ['year3_4'], true);
    expect(updateAutoWordSet).toHaveBeenCalledWith({
      autoWordSet: ['w1'],
      userPlatformId: mockUser.userPlatformId,
      autoConfig: { yearGroups: ['year3_4'], includeUserWords: true },
    });
  });
});
