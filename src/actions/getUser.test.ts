import { getUser } from './getUser';
import { getMongoDB } from '../lib/mongoDB';
import { DbUser } from './types';

jest.mock('../lib/mongoDB', () => ({
  getMongoDB: jest.fn(),
}));

describe('getUser', () => {
  let mockDb: any, mockCollection: any, mockFindOne: jest.Mock;

  beforeEach(() => {
    mockFindOne = jest.fn();
    mockCollection = { findOne: mockFindOne };
    mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
    (getMongoDB as jest.Mock).mockResolvedValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the user when found', async () => {
    const mockUser: DbUser = {
      _id: '1',
      userAuthId: 'auth123',
      userPlatformId: 'platform123',
      createdAt: 1735938406366,
      wordSets: [],
      words: [],
    };
    mockFindOne.mockResolvedValue(mockUser);

    const result = await getUser('auth123');

    expect(getMongoDB).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(result).toEqual(mockUser);
  });

  it('should return null when user is not found', async () => {
    mockFindOne.mockResolvedValue(null);

    const result = await getUser('auth123');

    expect(getMongoDB).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(result).toBeNull();
  });
});
