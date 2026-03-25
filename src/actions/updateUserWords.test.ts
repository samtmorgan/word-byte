import { getMongoDB } from '../lib/mongoDB';
import { mockUserWords } from '../testUtils/mockData';
import { updateUserWords } from './updateUserWords';

jest.mock('../lib/mongoDB', () => ({
  getMongoDB: jest.fn(),
}));

describe('updateUserWords', () => {
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

  it('should update user words', async () => {
    const mockUserPlatformId = 'mockUserPlatformId';
    await updateUserWords({ words: mockUserWords, userPlatformId: mockUserPlatformId });

    expect(getMongoDB).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('users');
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId: mockUserPlatformId },
      { $set: { words: mockUserWords } },
    );
  });

  it('should handle empty words array', async () => {
    await updateUserWords({ words: [], userPlatformId: 'user123' });

    expect(mockUpdateOne).toHaveBeenCalledWith({ userPlatformId: 'user123' }, { $set: { words: [] } });
  });
});
