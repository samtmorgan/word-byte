import { auth, clerkClient } from '@clerk/nextjs/server';
import { initialiseUser } from './initUser';
import { getUser } from './getUser';
import { mockAuthUserId, mockDbUser, mockUsername } from '../testUtils/mockData';
import { createUser } from './createUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { getTimeStamp } from '../utils/getTimeStamp';
import { User } from './types';
import { defaultWords } from '../constants';

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
jest.mock('./updateUserWordsAndWordSets', () => ({
  updateUserWordsAndWordSets: jest.fn(),
}));
jest.mock('./updateUserMode', () => ({
  updateUserMode: jest.fn(),
}));
jest.mock('./updateAutoWordSet', () => ({
  updateAutoWordSet: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../utils/getTimeStamp', () => ({
  getTimeStamp: jest.fn(),
}));

describe('initUser', () => {
  const mockAuth = auth as unknown as jest.Mock;
  const mockClerkClient = clerkClient as jest.Mock;
  const mockGetUser = getUser as jest.Mock;
  const mockUpdateUserWordsAndWordSets = updateUserWordsAndWordSets as jest.Mock;
  const mockClerkGetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getTimeStamp as jest.Mock).mockReturnValue(1234567890);
    mockUpdateUserWordsAndWordSets.mockResolvedValue(undefined);
  });

  it('should return a user when auth and db user are found, syncing new platform words', async () => {
    const originalWords = [...mockDbUser.words];
    mockAuth.mockResolvedValue({ userId: mockAuthUserId });
    mockClerkClient.mockResolvedValue({ users: { getUser: mockClerkGetUser } });
    mockClerkGetUser.mockResolvedValue({ username: mockUsername });
    mockGetUser.mockResolvedValue(JSON.parse(JSON.stringify(mockDbUser)));

    const result = await initialiseUser();

    expect(mockAuth).toHaveBeenCalled();
    expect(mockGetUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(mockClerkGetUser).toHaveBeenCalledWith(mockAuthUserId);
    // mockDbUser has one word with 'mockWordId' — all defaultWords are new
    expect(mockUpdateUserWordsAndWordSets).toHaveBeenCalledWith({
      words: [...originalWords, ...defaultWords],
      wordSets: mockDbUser.wordSets,
      userPlatformId: mockDbUser.userPlatformId,
    });
    expect(result?.username).toBe(mockUsername);
    expect(result?.words).toEqual([...originalWords, ...defaultWords]);
  });

  it('should not call updateUserWordsAndWordSets when user already has all platform words', async () => {
    const userWithAllWords = {
      ...mockDbUser,
      words: [...defaultWords],
    };
    mockAuth.mockResolvedValue({ userId: mockAuthUserId });
    mockClerkClient.mockResolvedValue({ users: { getUser: mockClerkGetUser } });
    mockClerkGetUser.mockResolvedValue({ username: mockUsername });
    mockGetUser.mockResolvedValue(userWithAllWords);

    const result = await initialiseUser();

    expect(mockUpdateUserWordsAndWordSets).not.toHaveBeenCalled();
    expect(result?.words).toEqual(defaultWords);
  });

  it('should return a user with a word that already exists in platform words and not duplicate it', async () => {
    const userWithOneDefaultWord = {
      ...mockDbUser,
      words: [defaultWords[0]],
    };
    mockAuth.mockResolvedValue({ userId: mockAuthUserId });
    mockClerkClient.mockResolvedValue({ users: { getUser: mockClerkGetUser } });
    mockClerkGetUser.mockResolvedValue({ username: mockUsername });
    mockGetUser.mockResolvedValue(JSON.parse(JSON.stringify(userWithOneDefaultWord)));

    const result = await initialiseUser();

    expect(result?.words).toEqual([...defaultWords]);
    expect(result?.words.filter(w => w.wordId === defaultWords[0].wordId)).toHaveLength(1);
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

  it('should throw an error when createUser fails', async () => {
    mockAuth.mockResolvedValue({ userId: mockAuthUserId });
    mockClerkGetUser.mockResolvedValue({ username: mockUsername });
    mockGetUser.mockResolvedValue(null);
    (createUser as jest.Mock).mockResolvedValue(null);

    await expect(initialiseUser()).rejects.toThrow('failed to write new user to db');

    expect(mockAuth).toHaveBeenCalled();
    expect(mockClerkGetUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(mockGetUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(createUser).toHaveBeenCalledWith(mockAuthUserId);
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
    expect(mockClerkGetUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(mockGetUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(createUser).toHaveBeenCalledWith(mockAuthUserId);
    expect(mockUpdateUserWordsAndWordSets).not.toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});
