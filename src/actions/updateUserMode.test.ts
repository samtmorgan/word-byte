import { updateUserMode } from './updateUserMode';
import { getMongoDB } from '../lib/mongoDB';

jest.mock('../lib/mongoDB', () => ({
  getMongoDB: jest.fn(),
}));

const VALID_UUID = '00000000-0000-4000-8000-000000000001';

describe('updateUserMode', () => {
  const mockUpdateOne = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getMongoDB as jest.Mock).mockResolvedValue({
      collection: () => ({ updateOne: mockUpdateOne }),
    });
  });

  it('updates mode in database', async () => {
    const result = await updateUserMode({ userPlatformId: VALID_UUID, mode: 'auto' });

    expect(result).toEqual({ success: true, data: undefined });
    expect(mockUpdateOne).toHaveBeenCalledWith({ userPlatformId: VALID_UUID }, { $set: { mode: 'auto' } });
  });

  it('includes autoConfig when provided', async () => {
    const result = await updateUserMode({
      userPlatformId: VALID_UUID,
      mode: 'manual',
      autoConfig: { yearGroups: ['year5_6'] },
    });

    expect(result).toEqual({ success: true, data: undefined });
    expect(mockUpdateOne).toHaveBeenCalledWith(
      { userPlatformId: VALID_UUID },
      { $set: { mode: 'manual', autoConfig: { yearGroups: ['year5_6'] } } },
    );
  });

  it('does not include autoConfig when not provided', async () => {
    await updateUserMode({ userPlatformId: VALID_UUID, mode: 'auto' });

    const setFields = mockUpdateOne.mock.calls[0][1].$set;
    expect(setFields).not.toHaveProperty('autoConfig');
  });

  it('returns VALIDATION_ERROR for invalid mode', async () => {
    const result = await updateUserMode({ userPlatformId: VALID_UUID, mode: 'invalid' as 'auto' });

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
    expect(mockUpdateOne).not.toHaveBeenCalled();
  });

  it('returns VALIDATION_ERROR for invalid UUID', async () => {
    const result = await updateUserMode({ userPlatformId: 'not-a-uuid', mode: 'auto' });

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
    expect(mockUpdateOne).not.toHaveBeenCalled();
  });
});
