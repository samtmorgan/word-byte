import { v4 as uuidv4 } from 'uuid';
import { createUser } from './createUser';
import { getUser } from './getUser';
import { getMongoDB } from '../lib/mongoDB';
import { defaultWords } from '../constants';

jest.mock('./getUser');
jest.mock('../lib/mongoDB', () => ({
  getMongoDB: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('createUser', () => {
  let mockDb: any, mockCollection: any;

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
    };
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (getMongoDB as jest.Mock).mockResolvedValue(mockDb);
    (uuidv4 as jest.Mock).mockReturnValue('mock-uuid');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user and return the user from the database', async () => {
    const mockUserAuthId = 'mockUserAuthId';
    const mockDbUser = {
      _id: 'mockId',
      userAuthId: mockUserAuthId,
      createdAt: Date.now(),
      wordSets: [],
      words: [...defaultWords],
      userPlatformId: 'mock-uuid',
    };

    (getUser as jest.Mock).mockResolvedValue(mockDbUser);

    const result = await createUser(mockUserAuthId);

    expect(getMongoDB).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('users');
    expect(mockCollection.insertOne).toHaveBeenCalledWith({
      userAuthId: mockUserAuthId,
      createdAt: expect.any(Number),
      wordSets: [],
      words: [...defaultWords],
      userPlatformId: 'mock-uuid',
    });
    expect(getUser).toHaveBeenCalledWith(mockUserAuthId);
    expect(result).toEqual(mockDbUser);
  });

  it('should return null if getUser returns null', async () => {
    const mockUserAuthId = 'mockUserAuthId';

    (getUser as jest.Mock).mockResolvedValue(null);

    const result = await createUser(mockUserAuthId);

    expect(getMongoDB).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('users');
    expect(mockCollection.insertOne).toHaveBeenCalledWith({
      userAuthId: mockUserAuthId,
      createdAt: expect.any(Number),
      wordSets: [],
      words: [...defaultWords],
      userPlatformId: 'mock-uuid',
    });
    expect(getUser).toHaveBeenCalledWith(mockUserAuthId);
    expect(result).toBeNull();
  });
});
