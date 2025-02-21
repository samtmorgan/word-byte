import { mockUser } from '../testUtils/mockData';
import { buildWordSetData } from '../utils/buildWordSetData';
import { getCurrentWords } from './getCurrentWords';
import { initialiseUser } from './initUser';

jest.mock('./initUser', () => ({
  initialiseUser: jest.fn(),
}));
jest.mock('../utils/buildWordSetData', () => ({
  buildWordSetData: jest.fn(),
}));

describe('getCurrentWords', () => {
  beforeEach(() => {
    (buildWordSetData as jest.Mock).mockReturnValue([
      { owner: 'platform', results: [], word: 'mockWord', wordId: 'mockWordId' },
    ]);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return current words from initUser', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await getCurrentWords();

    expect(result).toEqual([{ owner: 'platform', results: [], word: 'mockWord', wordId: 'mockWordId' }]);
    expect(initialiseUser).toHaveBeenCalledTimes(1);
  });

  it('should return null if initUser returns no currentWords', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await getCurrentWords();

    expect(result).toEqual(null);
    expect(initialiseUser).toHaveBeenCalledTimes(1);
  });

  it('should return null if buildWordSetData returns null', async () => {
    (buildWordSetData as jest.Mock).mockReturnValue(null);
    (initialiseUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await getCurrentWords();

    expect(result).toEqual(null);
    expect(initialiseUser).toHaveBeenCalledTimes(1);
    expect(buildWordSetData).toHaveBeenCalledTimes(1);
    expect(buildWordSetData).toHaveBeenCalledWith(mockUser.wordSets, mockUser.words, 0);
  });
});
