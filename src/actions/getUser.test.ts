import { getUser, User } from './getUser';
import client from '../lib/mongoClient';

jest.mock('../lib/mongoClient', () => ({
  connect: jest.fn(),
}));

describe('getUser', () => {
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

  it('should return the user and when found', async () => {
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

    const result = await getUser('auth123');

    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(result).toEqual(mockUser);
  });

  it('should return null and status ok when user is not found', async () => {
    mockFindOne.mockResolvedValue(null);

    const result = await getUser('auth123');

    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(result).toEqual(null);
  });
});
