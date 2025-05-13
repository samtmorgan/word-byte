import client from '../lib/mongoClient';
import { mockUserWords } from '../testUtils/mockData';
import { updateUserWords } from './updateUserWords';

jest.mock('../lib/mongoClient', () => ({
  connect: jest.fn(),
}));

describe.skip('updateUserWords', () => {
  let mockConnect: jest.Mock, mockDb: jest.Mock, mockCollection: jest.Mock, mockUpdateOne: jest.Mock;

  beforeEach(() => {
    mockUpdateOne = jest.fn();
    mockCollection = jest.fn(() => ({ updateOne: mockUpdateOne }));
    mockDb = jest.fn(() => ({ collection: mockCollection }));
    mockConnect = jest.fn(() => ({ db: mockDb }));
    (client.connect as jest.Mock) = mockConnect;
  });

  it('should update user words', async () => {
    const mockUserPlatformId = 'mockUserPlatformId';
    await updateUserWords({ words: mockUserWords, userPlatformId: mockUserPlatformId });
    expect(client.connect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith('wordByteTest');
    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId: mockUserPlatformId },
      { $set: { words: mockUserWords } },
    );
  });
});
