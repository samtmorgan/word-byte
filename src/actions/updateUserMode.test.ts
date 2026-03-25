import { updateUserMode } from './updateUserMode';
import { getMongoDB } from '../lib/mongoDB';

jest.mock('../lib/mongoDB', () => ({
  getMongoDB: jest.fn(),
}));

describe('updateUserMode', () => {
  let mockDb: any, mockCollection: any, mockUpdateOne: jest.Mock;

  beforeEach(() => {
    mockUpdateOne = jest.fn();
    mockCollection = { updateOne: mockUpdateOne };
    mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
    (getMongoDB as jest.Mock).mockResolvedValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update mode without autoConfig', async () => {
    await updateUserMode({ userPlatformId: 'user123', mode: 'auto' });

    expect(getMongoDB).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('users');
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId: 'user123' },
      { $set: { mode: 'auto' } },
    );
  });

  it('should update mode to manual', async () => {
    await updateUserMode({ userPlatformId: 'user123', mode: 'manual' });

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId: 'user123' },
      { $set: { mode: 'manual' } },
    );
  });

  it('should include autoConfig in update when provided', async () => {
    const autoConfig = { yearGroups: ['year3_4' as const], includeUserWords: false };

    await updateUserMode({ userPlatformId: 'user123', mode: 'auto', autoConfig });

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId: 'user123' },
      { $set: { mode: 'auto', autoConfig } },
    );
  });
});
