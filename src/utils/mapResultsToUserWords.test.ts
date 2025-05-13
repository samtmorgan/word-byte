import { mapResultsToUserWords } from './mapResultsToUserWords';
import { mockLocalResults, mockUserWords } from '../testUtils/mockData';
import { WordOwner } from '../actions/types';

jest.mock('../utils/getTimeStamp', () => ({
  getTimeStamp: jest.fn(() => 123),
}));

describe('mapResultsToUserWords', () => {
  it('should update results for words with matching wordIds', () => {
    const expected = [
      {
        word: 'testWord1',
        wordId: 'testWordId1',
        owner: WordOwner.PLATFORM,
        results: [
          {
            created: 0o0,
            pass: true,
          },
        ],
      },
      {
        word: 'testWord2',
        wordId: 'testWordId2',
        owner: WordOwner.PLATFORM,
        results: [
          {
            created: 0o0,
            pass: false,
          },
          {
            created: 123,
            pass: true,
          },
        ],
      },
      {
        word: 'testWord3',
        wordId: 'testWordId3',
        owner: WordOwner.PLATFORM,
        results: [
          {
            created: 123,
            pass: false,
          },
        ],
      },
    ];

    const result = mapResultsToUserWords({
      localResults: mockLocalResults,
      userWords: mockUserWords,
    });

    expect(result).toEqual(expected);
  });
});
