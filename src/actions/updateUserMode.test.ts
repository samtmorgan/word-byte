import { updateUserMode } from './updateUserMode';
import { getMongoDB } from '../lib/mongoDB';

jest.mock('../lib/mongoDB', () => ({
  getMongoDB: jest.fn(),
}));

describe('updateUserMode', () => {
  const mockUpdateOne = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getMongoDB as jest.Mock).mockResolvedValue({
      collection: () => ({ updateOne: mockUpdateOne }),
    });
  });

  it('updates mode in database', async () => {
    await updateUserMode({ userPlatformId: 'p1', mode: 'auto' });

    expect(mockUpdateOne).toHaveBeenCalledWith({ userPlatformId: 'p1' }, { $set: { mode: 'auto' } });
  });

  it('includes autoConfig when provided', async () => {
    await updateUserMode({
      userPlatformId: 'p1',
      mode: 'manual',
      autoConfig: { yearGroups: ['year5_6'] },
    });

    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId: 'p1' },
      { $set: { mode: 'manual', autoConfig: { yearGroups: ['year5_6'] } } },
    );
  });

  it('does not include autoConfig when not provided', async () => {
    await updateUserMode({ userPlatformId: 'p1', mode: 'auto' });

    const setFields = mockUpdateOne.mock.calls[0][1].$set;
    expect(setFields).not.toHaveProperty('autoConfig');
  });
});
