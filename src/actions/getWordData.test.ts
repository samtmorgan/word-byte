import { mockUser } from '../testUtils/mockData';
import { buildWordSetData } from '../utils/buildWordSetData';
import { getWordData } from './getWordData';
import { initialiseUser } from './initUser';

jest.mock('./initUser', () => ({
  initialiseUser: jest.fn(),
}));
jest.mock('../utils/buildWordSetData', () => ({
  buildWordSetData: jest.fn(),
}));

describe('getWordData', () => {
  beforeEach(() => {
    (initialiseUser as jest.Mock).mockResolvedValue(mockUser);
    (buildWordSetData as jest.Mock).mockReturnValue([
      { owner: 'platform', results: [], word: 'mockWord', wordId: 'mockWordId' },
    ]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return word data', async () => {
    // Act
    const result = await getWordData();

    // Assert
    expect(result).toEqual({
      currentWords: [{ owner: 'platform', results: [], word: 'mockWord', wordId: 'mockWordId' }],
      wordSets: mockUser.wordSets,
      words: mockUser.words,
      username: mockUser.username,
      userPlatformId: mockUser.userPlatformId,
    });
    expect(initialiseUser).toHaveBeenCalled();
    expect(buildWordSetData).toHaveBeenCalledWith(mockUser.wordSets, mockUser.words, 0);
  });

  it('should return null if no user', async () => {
    // Arrange
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    // Act
    const result = await getWordData();

    // Assert
    expect(result).toBeNull();
    expect(initialiseUser).toHaveBeenCalled();
    expect(buildWordSetData).not.toHaveBeenCalled();
  });
});
