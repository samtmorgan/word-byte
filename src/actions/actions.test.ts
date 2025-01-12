import { getUser, User } from './actions';
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

  it('should return a user when found', async () => {
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

    const user = await getUser('auth123');

    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(user).toEqual(mockUser);
  });

  it('should return null when user is not found', async () => {
    mockFindOne.mockResolvedValue(null);

    const user = await getUser('auth123');

    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(user).toBeNull();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should return "error" and log an error when an error occurs', async () => {
    mockFindOne.mockRejectedValue(new Error('Database error'));

    const user = await getUser('auth123');

    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockFindOne).toHaveBeenCalledWith({ userAuthId: 'auth123' });
    expect(user).toEqual('error');
    expect(console.error).toHaveBeenCalled();
  });
});
