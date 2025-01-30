import { auth, clerkClient } from '@clerk/nextjs/server';
import initUser, { DbUser, User } from './initUser';
import { getUser } from './getUser';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
  clerkClient: jest.fn(() => ({
    users: {
      getUser: jest.fn(),
    },
  })),
}));

jest.mock('./getUser', () => ({
  getUser: jest.fn(),
}));

describe('initUser', () => {
  const mockAuth = auth as unknown as jest.Mock;
  const mockClerkClient = clerkClient as jest.Mock;
  const mockGetUser = getUser as jest.Mock;
  const mockClerkGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user when auth and db user are found', async () => {
    const mockUserId = 'auth123';
    const mockUsername = 'testUser';
    const mockDbUser: DbUser = {
      _id: '1',
      userAuthId: mockUserId,
      userPlatformId: 'platform123',
      createdAt: 1735938406366,
      wordSets: [],
      words: [],
    };
    const expected: User = {
      ...mockDbUser,
      username: mockUsername,
    };

    mockAuth.mockResolvedValue({ userId: mockUserId });
    mockClerkClient.mockResolvedValue({ users: { getUser: mockClerkGetUser } });
    mockClerkGetUser.mockResolvedValue({ username: mockUsername });
    mockGetUser.mockResolvedValue(mockDbUser);

    const result = await initUser();

    expect(mockAuth).toHaveBeenCalled();
    expect(mockGetUser).toHaveBeenCalledWith(mockUserId);
    expect(mockClerkGetUser).toHaveBeenCalledWith(mockUserId);
    expect(result).toEqual(expected);
  });

  it('should throw an error when no auth userId is found', async () => {
    mockAuth.mockResolvedValue({ userId: null });

    await expect(initUser()).rejects.toThrow('no auth userId found');

    expect(mockAuth).toHaveBeenCalled();
    expect(mockClerkGetUser).not.toHaveBeenCalled();
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it('should throw an error when no auth username is found', async () => {
    const mockUserId = 'auth123';

    mockAuth.mockResolvedValue({ userId: mockUserId });
    mockClerkGetUser.mockResolvedValue({ username: null });

    await expect(initUser()).rejects.toThrow('no auth username found');
    expect(mockAuth).toHaveBeenCalled();
    expect(mockClerkGetUser).toHaveBeenCalledWith(mockUserId);
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it('should throw an error when no db user is found', async () => {
    const mockUserId = 'auth123';
    const mockUsername = 'testUser';

    mockAuth.mockResolvedValue({ userId: mockUserId });
    mockClerkGetUser.mockResolvedValue({ username: mockUsername });
    mockGetUser.mockResolvedValue(null);

    await expect(initUser()).rejects.toThrow('no user found');
    expect(mockAuth).toHaveBeenCalled();
    expect(mockClerkGetUser).toHaveBeenCalledWith(mockUserId);
    expect(mockGetUser).toHaveBeenCalledWith(mockUserId);
  });
});
