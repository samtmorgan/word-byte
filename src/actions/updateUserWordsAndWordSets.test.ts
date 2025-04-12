import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import client from '../lib/mongoClient';
import { Word, WordOwner, WordSet } from './types';

jest.mock('../lib/mongoClient', () => ({
  connect: jest.fn(),
}));

describe('updateUserWords', () => {
  let mockConnect: jest.Mock, mockDb: jest.Mock, mockCollection: jest.Mock, mockUpdateOne: jest.Mock;

  beforeEach(() => {
    mockUpdateOne = jest.fn();
    mockCollection = jest.fn(() => ({ updateOne: mockUpdateOne }));
    mockDb = jest.fn(() => ({ collection: mockCollection }));
    mockConnect = jest.fn(() => ({ db: mockDb }));
    (client.connect as jest.Mock) = mockConnect;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update user words and word sets in the database', async () => {
    const words: Word[] = [{ wordId: '1', word: 'hello', results: [], owner: WordOwner.USER }];
    const wordSets: WordSet[] = [{ wordSetId: '1', createdAt: 123, wordIds: ['hello'] }];
    const userPlatformId = 'user123';

    await updateUserWordsAndWordSets({ words, wordSets, userPlatformId });

    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId },
      {
        $set: {
          words,
          wordSets,
        },
      },
    );
  });

  it('should handle empty words and word sets', async () => {
    const words: Word[] = [];
    const wordSets: WordSet[] = [];
    const userPlatformId = 'user123';

    await updateUserWordsAndWordSets({ words, wordSets, userPlatformId });

    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId },
      {
        $set: {
          words,
          wordSets,
        },
      },
    );
  });

  it('should throw an error if the database connection fails', async () => {
    (client.connect as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

    const words: Word[] = [{ wordId: '1', word: 'hello', results: [], owner: WordOwner.USER }];
    const wordSets: WordSet[] = [{ wordSetId: '1', createdAt: 123, wordIds: ['hello'] }];
    const userPlatformId = 'user123';

    await expect(updateUserWordsAndWordSets({ words, wordSets, userPlatformId })).rejects.toThrow(
      'Database connection failed',
    );
  });
});
