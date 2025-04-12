import { v4 as uuidv4 } from 'uuid';
import { createUser } from './createUser';
import { getUser } from './getUser';
import { getMongoDB } from '../lib/mongoDB';
import { defaultWords } from '../constants';
import { getTimeStamp } from '../utils/getTimeStamp';

jest.mock('./getUser');
jest.mock('../lib/mongoDB', () => ({
  getMongoDB: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));
jest.mock('../utils/getTimeStamp', () => ({
  getTimeStamp: jest.fn(),
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
    (getTimeStamp as jest.Mock).mockReturnValue(1738564351133);
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
      wordSets: [
        {
          createdAt: 1738564351133,
          wordIds: [
            'd659c3a4-4ea2-4619-b4da-53b6550d925f',
            'b02b5c18-1ed6-40e5-bf4b-dc268a1b8866',
            'e13e18b1-7c04-4dae-8a02-6898848d168b',
            '1ed7098e-e2a7-4607-940c-cdb7f49b3bc0',
            '8ec8b1ff-50a1-4152-bae2-01ff3e5450ad',
            'fbc6c6b1-df0b-4015-94c9-01207ceb4471',
            '26dd4d7a-045c-4103-8461-1466bd4b84c1',
            'a86b4f9e-7027-4940-9345-fed0951c87b0',
            '26dd4d7a-045c-4103-8461-1466bd4b84c1',
            'a86b4f9e-7027-4940-9345-fed0951c87b0',
          ],
          wordSetId: 'mock-uuid',
        },
      ],
      words: [...defaultWords],
      userPlatformId: 'mock-uuid',
    };

    (getUser as jest.Mock).mockResolvedValue(mockDbUser);

    const result = await createUser(mockUserAuthId);

    expect(getMongoDB).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('users');
    expect(mockCollection.insertOne).toHaveBeenCalledWith({
      userAuthId: mockUserAuthId,
      createdAt: 1738564351133,
      wordSets: [
        {
          createdAt: 1738564351133,
          wordIds: [
            'd659c3a4-4ea2-4619-b4da-53b6550d925f',
            'b02b5c18-1ed6-40e5-bf4b-dc268a1b8866',
            'e13e18b1-7c04-4dae-8a02-6898848d168b',
            '1ed7098e-e2a7-4607-940c-cdb7f49b3bc0',
            '8ec8b1ff-50a1-4152-bae2-01ff3e5450ad',
            'fbc6c6b1-df0b-4015-94c9-01207ceb4471',
            '26dd4d7a-045c-4103-8461-1466bd4b84c1',
            'a86b4f9e-7027-4940-9345-fed0951c87b0',
            '35f7a198-d160-40ab-ae2e-597c3112ec15',
            'f3edfc26-b5ae-4ce7-8b0f-817ee4982d0c',
          ],
          wordSetId: 'mock-uuid',
        },
      ],
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
      wordSets: [
        {
          createdAt: 1738564351133,
          wordIds: [
            'd659c3a4-4ea2-4619-b4da-53b6550d925f',
            'b02b5c18-1ed6-40e5-bf4b-dc268a1b8866',
            'e13e18b1-7c04-4dae-8a02-6898848d168b',
            '1ed7098e-e2a7-4607-940c-cdb7f49b3bc0',
            '8ec8b1ff-50a1-4152-bae2-01ff3e5450ad',
            'fbc6c6b1-df0b-4015-94c9-01207ceb4471',
            '26dd4d7a-045c-4103-8461-1466bd4b84c1',
            'a86b4f9e-7027-4940-9345-fed0951c87b0',
            '35f7a198-d160-40ab-ae2e-597c3112ec15',
            'f3edfc26-b5ae-4ce7-8b0f-817ee4982d0c',
          ],
          wordSetId: 'mock-uuid',
        },
      ],
      words: [...defaultWords],
      userPlatformId: 'mock-uuid',
    });
    expect(getUser).toHaveBeenCalledWith(mockUserAuthId);
    expect(result).toBeNull();
  });
});
