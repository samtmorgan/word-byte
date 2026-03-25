import { updateAutoWordSet } from './updateAutoWordSet';
import { getMongoDB } from '../lib/mongoDB';

jest.mock('../lib/mongoDB', () => ({
  getMongoDB: jest.fn(),
}));

describe('updateAutoWordSet', () => {
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

  it('should update autoWordSet only when no optional fields provided', async () => {
    const autoWordSet = ['id1', 'id2'];
    const userPlatformId = 'user123';

    await updateAutoWordSet({ autoWordSet, userPlatformId });

    expect(getMongoDB).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith('users');
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId },
      { $set: { autoWordSet } },
    );
  });

  it('should include autoConfig in update when provided', async () => {
    const autoWordSet = ['id1'];
    const userPlatformId = 'user123';
    const autoConfig = { yearGroups: ['year3_4' as const], includeUserWords: true };

    await updateAutoWordSet({ autoWordSet, userPlatformId, autoConfig });

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId },
      { $set: { autoWordSet, autoConfig } },
    );
  });

  it('should include dataVersion in update when provided', async () => {
    const autoWordSet = ['id1'];
    const userPlatformId = 'user123';

    await updateAutoWordSet({ autoWordSet, userPlatformId, dataVersion: 2 });

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId },
      { $set: { autoWordSet, dataVersion: 2 } },
    );
  });

  it('should include both autoConfig and dataVersion when both provided', async () => {
    const autoWordSet = ['id1', 'id2'];
    const userPlatformId = 'user123';
    const autoConfig = { yearGroups: ['year5_6' as const] };

    await updateAutoWordSet({ autoWordSet, userPlatformId, autoConfig, dataVersion: 1 });

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId },
      { $set: { autoWordSet, autoConfig, dataVersion: 1 } },
    );
  });

  it('should handle empty autoWordSet', async () => {
    await updateAutoWordSet({ autoWordSet: [], userPlatformId: 'user123' });

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId: 'user123' },
      { $set: { autoWordSet: [] } },
    );
  });
});
