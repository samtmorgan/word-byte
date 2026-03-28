import { updateAutoWordSet } from './updateAutoWordSet';
import { getMongoDB } from '../lib/mongoDB';

jest.mock('../lib/mongoDB', () => ({
  getMongoDB: jest.fn(),
}));

describe('updateAutoWordSet', () => {
  const mockUpdateOne = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getMongoDB as jest.Mock).mockResolvedValue({
      collection: () => ({ updateOne: mockUpdateOne }),
    });
  });

  it('updates autoWordSet in database', async () => {
    await updateAutoWordSet({ autoWordSet: ['w1', 'w2'], userPlatformId: 'p1' });

    expect(mockUpdateOne).toHaveBeenCalledWith({ userPlatformId: 'p1' }, { $set: { autoWordSet: ['w1', 'w2'] } });
  });

  it('includes autoConfig when provided', async () => {
    await updateAutoWordSet({
      autoWordSet: ['w1'],
      userPlatformId: 'p1',
      autoConfig: { yearGroups: ['year3_4'], includeUserWords: true },
    });

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId: 'p1' },
      { $set: { autoWordSet: ['w1'], autoConfig: { yearGroups: ['year3_4'], includeUserWords: true } } },
    );
  });

  it('includes dataVersion when provided', async () => {
    await updateAutoWordSet({
      autoWordSet: ['w1'],
      userPlatformId: 'p1',
      dataVersion: 2,
    });

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId: 'p1' },
      { $set: { autoWordSet: ['w1'], dataVersion: 2 } },
    );
  });

  it('does not include optional fields when not provided', async () => {
    await updateAutoWordSet({ autoWordSet: [], userPlatformId: 'p1' });

    expect(mockUpdateOne).toHaveBeenCalledWith({ userPlatformId: 'p1' }, { $set: { autoWordSet: [] } });
  });
});
