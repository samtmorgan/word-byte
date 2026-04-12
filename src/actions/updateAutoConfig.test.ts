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

  it('returns INIT_FAILED when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await updateAutoConfig({ yearGroups: ['year3_4'], includeUserWords: false });

    expect(result).toEqual({ success: false, code: 'INIT_FAILED', error: expect.any(String) });
    expect(updateAutoWordSet).not.toHaveBeenCalled();
  });

  it('returns VALIDATION_ERROR for empty yearGroups', async () => {
    const result = await updateAutoConfig({ yearGroups: [], includeUserWords: false });

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
    expect(initialiseUser).not.toHaveBeenCalled();
  });

  it('returns VALIDATION_ERROR for invalid yearGroup value', async () => {
    const result = await updateAutoConfig({ yearGroups: ['year7_8' as 'year3_4'], includeUserWords: false });

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
  });

  it('rebuilds auto word set with new config', async () => {
    const mockWords = [{ word: 'test', wordId: 'w1', owner: WordOwner.PLATFORM, results: [], yearGroup: 'year3_4' }];
    (initialiseUser as jest.Mock).mockResolvedValue({ ...mockUser, words: mockWords });
    (buildInitialAutoWordSet as jest.Mock).mockReturnValue(mockWords);

    const result = await updateAutoConfig({ yearGroups: ['year3_4'], includeUserWords: true });

    expect(result).toEqual({ success: true, data: undefined });
    expect(buildInitialAutoWordSet).toHaveBeenCalledWith(mockWords, ['year3_4'], true);
    expect(updateAutoWordSet).toHaveBeenCalledWith({
      autoWordSet: ['w1'],
      userPlatformId: mockUser.userPlatformId,
      autoConfig: { yearGroups: ['year3_4'], includeUserWords: true },
    });
  });
});
