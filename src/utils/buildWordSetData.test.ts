import { mockUser } from '../testUtils/mockData';
import { buildWordSetData } from './buildWordSetData';

describe('buildWordSetData', () => {
  it('should build word set data', () => {
    // Arrange
    const { wordSets } = mockUser;
    const { words } = mockUser;
    const index = 0;

    // Act
    const result = buildWordSetData(wordSets, words, index);

    // Assert
    expect(result).toEqual([{ owner: 'platform', results: [], word: 'mockWord', wordId: 'mockWordId' }]);
  });
});
