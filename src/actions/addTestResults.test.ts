import { mockLocalResults } from '../testUtils/mockData';
import { mapResultsToUserWords } from '../utils/mapResultsToUserWords';
import { addTestResults } from './addTestResults';
import { initialiseUser } from './initUser';
import { WordOwner } from './types';
import { updateUserWords } from './updateUserWords';

jest.mock('./updateUserWords.ts', () => ({
  updateUserWords: jest.fn(),
}));
jest.mock('./initUser.ts', () => ({
  initialiseUser: jest.fn(),
}));
jest.mock('../utils/mapResultsToUserWords.ts', () => ({
  mapResultsToUserWords: jest.fn(),
}));

describe('addTestResults', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should call functions as expected', async () => {
    // arrange
    (initialiseUser as jest.Mock).mockResolvedValue({
      userPlatformId: 'platform123',
      words: [],
    });
    (mapResultsToUserWords as jest.Mock).mockReturnValue([
      {
        word: 'testWord1',
        wordId: 'testWordId1',
        owner: WordOwner.PLATFORM,
        results: [
          {
            created: 123,
            pass: true,
          },
        ],
      },
    ]);

    // act
    await addTestResults(mockLocalResults);

    // assert
    expect(updateUserWords).toHaveBeenCalledWith({
      words: [
        {
          word: 'testWord1',
          wordId: 'testWordId1',
          owner: WordOwner.PLATFORM,
          results: [
            {
              created: 123,
              pass: true,
            },
          ],
        },
      ],
      userPlatformId: 'platform123',
    });
    expect(initialiseUser).toHaveBeenCalled();
    expect(mapResultsToUserWords).toHaveBeenCalledWith({
      localResults: mockLocalResults,
      userWords: [],
    });
  });

  it('should throw an error if initialiseUser fails', async () => {
    // arrange
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    // act
    await expect(addTestResults(mockLocalResults)).rejects.toThrow("couldn't initialise user");

    // assert
    expect(initialiseUser).toHaveBeenCalled();
    expect(updateUserWords).not.toHaveBeenCalled();
    expect(mapResultsToUserWords).not.toHaveBeenCalled();
  });
});
