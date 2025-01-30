import client from '../lib/mongoClient';

import { getCurrentWords, User, Word } from './actions';

jest.mock('../lib/mongoClient', () => ({
  connect: jest.fn(),
}));

describe('getCurrentWords', () => {
  let mockConnect: jest.Mock, mockDb: jest.Mock, mockCollection: jest.Mock, mockFindOne: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockCollection = jest.fn(() => ({ findOne: mockFindOne }));
    mockDb = jest.fn(() => ({ collection: mockCollection }));
    mockConnect = jest.fn(() => ({ db: mockDb }));
    (client.connect as jest.Mock) = mockConnect;
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the current words when found', async () => {
    const mockWords: Word[] = [
      {
        word: 'word1',
        wordId: 'word1',
        owner: 'platform',
        results: [],
      },
      {
        word: 'word2',
        wordId: 'word2',
        owner: 'platform',
        results: [],
      },
    ];

    const mockUser: User = {
      _id: '1',
      userAuthId: 'auth123',
      userPlatformId: 'platform123',
      userName: 'testUser',
      createdAt: 1735938406366,
      wordSets: [
        {
          wordSetId: 'wordSet1',
          createdAt: 1735938406366,
          wordIds: ['word1', 'word2'],
        },
      ],
      words: mockWords,
    };

    mockFindOne.mockResolvedValue(mockUser);

    const expected = { status: 'ok', currentWords: mockWords };
    const result = await getCurrentWords('auth123');

    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(result).toEqual(expected);
  });

  it('should return an error response when user is not found', async () => {
    mockFindOne.mockResolvedValue(null);

    const expected = { status: 'error', message: 'userNotFound' };
    const result = await getCurrentWords('auth123');

    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(result).toEqual(expected);
  });

  it('should return status ok and no words when no word sets are found', async () => {
    const mockUser: User = {
      _id: '1',
      userAuthId: 'auth123',
      userPlatformId: 'platform123',
      userName: 'testUser',
      createdAt: 1735938406366,
      wordSets: [],
      words: [],
    };
    mockFindOne.mockResolvedValue(mockUser);

    const expected = { status: 'ok', currentWords: null };
    const result = await getCurrentWords('auth123');

    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(result).toEqual(expected);
  });

  it('should return status ok and no words when word set has no words', async () => {
    const mockUser: User = {
      _id: '1',
      userAuthId: 'auth123',
      userPlatformId: 'platform123',
      userName: 'testUser',
      createdAt: 1735938406366,
      wordSets: [
        {
          wordSetId: 'wordSet1',
          createdAt: 1735938406366,
          wordIds: [],
        },
      ],
      words: [],
    };
    mockFindOne.mockResolvedValue(mockUser);

    const expected = { status: 'ok', currentWords: null };
    const result = await getCurrentWords('auth123');

    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(result).toEqual(expected);
  });

  it('should return status ok and no words when word ids do not match any words', async () => {
    const mockUser: User = {
      _id: '1',
      userAuthId: 'auth123',
      userPlatformId: 'platform123',
      userName: 'testUser',
      createdAt: 1735938406366,
      wordSets: [
        {
          wordSetId: 'wordSet1',
          createdAt: 1735938406366,
          wordIds: ['word3', 'word4'],
        },
      ],
      words: [
        {
          word: 'word1',
          wordId: 'word1',
          owner: 'platform',
          results: [],
        },
        {
          word: 'word2',
          wordId: 'word2',
          owner: 'platform',
          results: [],
        },
      ],
    };
    mockFindOne.mockResolvedValue(mockUser);

    const expected = { status: 'ok', currentWords: null };
    const result = await getCurrentWords('auth123');

    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(result).toEqual(expected);
  });

  it('should return status error and the correct message when an error occurs', async () => {
    mockFindOne.mockRejectedValue(new Error('Database error'));

    const expected = { status: 'error', message: 'getCurrentWordsError' };
    const result = await getCurrentWords('auth123');

    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(result).toEqual(expected);
  });
});
