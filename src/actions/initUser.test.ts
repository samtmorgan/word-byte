import { auth, clerkClient } from '@clerk/nextjs/server';
import { initialiseUser } from './initUser';
import { getUser } from './getUser';
import { mockAuthUserId, mockDbUser, mockUsername } from '../testUtils/mockData';
import { createUser } from './createUser';
import { getTimeStamp } from '../utils/getTimeStamp';
import { User } from './types';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
  clerkClient: jest.fn(() => ({
    users: {
      getUser: jest.fn(),
    },
  })),
}));
jest.mock('./createUser', () => ({
  createUser: jest.fn(),
}));
jest.mock('./getUser', () => ({
  getUser: jest.fn(),
}));
jest.mock('../utils/getTimeStamp', () => ({
  getTimeStamp: jest.fn(),
}));

describe('initUser', () => {
  const mockAuth = auth as unknown as jest.Mock;
  const mockClerkClient = clerkClient as jest.Mock;
  const mockGetUser = getUser as jest.Mock;
  const mockClerkGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getTimeStamp as jest.Mock).mockReturnValue(1234567890);
  });

  it('should return a user when auth and db user are found', async () => {
    const expected: User = {
      ...mockDbUser,
      username: mockUsername,
    };

    mockAuth.mockResolvedValue({ userId: mockAuthUserId });
    mockClerkClient.mockResolvedValue({ users: { getUser: mockClerkGetUser } });
    mockClerkGetUser.mockResolvedValue({ username: mockUsername });
    mockGetUser.mockResolvedValue(mockDbUser);

    const result = await initialiseUser();

    expect(mockAuth).toHaveBeenCalled();
    expect(mockGetUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(mockClerkGetUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(result).toEqual(expected);
  });

  it('should throw an error when no auth userId is found', async () => {
    mockAuth.mockResolvedValue({ userId: null });

    await expect(initialiseUser()).rejects.toThrow('no auth userAuthId found');

    expect(mockAuth).toHaveBeenCalled();
    expect(mockClerkGetUser).not.toHaveBeenCalled();
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it('should throw an error when no auth username is found', async () => {
    mockAuth.mockResolvedValue({ userId: mockAuthUserId });
    mockClerkGetUser.mockResolvedValue({ username: null });

    await expect(initialiseUser()).rejects.toThrow('no auth username found');
    expect(mockAuth).toHaveBeenCalled();
    expect(mockClerkGetUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it('should create a new user when no db user is found', async () => {
    mockAuth.mockResolvedValue({ userId: mockAuthUserId });
    mockClerkGetUser.mockResolvedValue({ username: mockUsername });
    mockGetUser.mockResolvedValue(null);
    (createUser as jest.Mock).mockResolvedValue(mockDbUser);

    const expected: User = {
      ...mockDbUser,
      username: mockUsername,
    };

    const result = await initialiseUser();

    expect(mockAuth).toHaveBeenCalled();
    expect(mockAuth).toHaveBeenCalled();
    expect(mockClerkGetUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(mockGetUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(createUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(result).toEqual(expected);
  });
});
