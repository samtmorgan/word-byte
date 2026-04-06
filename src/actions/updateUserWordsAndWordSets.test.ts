import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { getMongoDB } from '../lib/mongoDB';
import { Word, WordOwner, WordSet } from './types';

jest.mock('../lib/mongoDB', () => ({
  getMongoDB: jest.fn(),
}));

describe('updateUserWordsAndWordSets', () => {
  let mockUpdateOne: jest.Mock;

  beforeEach(() => {
    mockUpdateOne = jest.fn();
    (getMongoDB as jest.Mock).mockResolvedValue({
      collection: jest.fn(() => ({ updateOne: mockUpdateOne })),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update user words and word sets in the database', async () => {
    const words: Word[] = [{ wordId: '1', word: 'hello', results: [], owner: WordOwner.USER }];
    const wordSets: WordSet[] = [{ wordSetId: '1', createdAt: 123, wordIds: ['hello'] }];
    const userPlatformId = 'user123';

    await updateUserWordsAndWordSets({ words, wordSets, userPlatformId });

    expect(getMongoDB).toHaveBeenCalled();
    expect(mockUpdateOne).toHaveBeenCalledWith({ userPlatformId }, { $set: { words, wordSets } });
  });

  it('should handle empty words and word sets', async () => {
    const words: Word[] = [];
    const wordSets: WordSet[] = [];
    const userPlatformId = 'user123';

    await updateUserWordsAndWordSets({ words, wordSets, userPlatformId });

    expect(getMongoDB).toHaveBeenCalled();
    expect(mockUpdateOne).toHaveBeenCalledWith({ userPlatformId }, { $set: { words, wordSets } });
  });

  it('should throw an error if the database connection fails', async () => {
    (getMongoDB as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

    const words: Word[] = [{ wordId: '1', word: 'hello', results: [], owner: WordOwner.USER }];
    const wordSets: WordSet[] = [{ wordSetId: '1', createdAt: 123, wordIds: ['hello'] }];
    const userPlatformId = 'user123';

    await expect(updateUserWordsAndWordSets({ words, wordSets, userPlatformId })).rejects.toThrow(
      'Database connection failed',
    );
  });
});
