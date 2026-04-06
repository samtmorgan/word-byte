import { getMongoDB } from '../lib/mongoDB';
import { mockUserWords } from '../testUtils/mockData';
import { updateUserWords } from './updateUserWords';

jest.mock('../lib/mongoDB', () => ({
  getMongoDB: jest.fn(),
}));

describe('updateUserWords', () => {
  let mockUpdateOne: jest.Mock;

  beforeEach(() => {
    mockUpdateOne = jest.fn();
    (getMongoDB as jest.Mock).mockResolvedValue({
      collection: jest.fn(() => ({ updateOne: mockUpdateOne })),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update user words', async () => {
    const mockUserPlatformId = 'mockUserPlatformId';
    await updateUserWords({ words: mockUserWords, userPlatformId: mockUserPlatformId });
    expect(getMongoDB).toHaveBeenCalled();
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId: mockUserPlatformId },
      { $set: { words: mockUserWords } },
    );
  });
});
