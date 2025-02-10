import { mockUser } from '../testUtils/mockData';
import { getCurrentWords } from './getCurrentWords';
import { initialiseUser } from './initUser';

jest.mock('./initUser', () => ({
  initialiseUser: jest.fn(),
}));

describe('getCurrentWords', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should return current words from initUser', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await getCurrentWords();

    expect(result).toEqual([{ owner: 'platform', results: [], word: 'mockWord', wordId: 'mockWordId' }]);
    expect(initialiseUser).toHaveBeenCalledTimes(1);
  });

  it('should return empty array if initUser returns no currentWords', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await getCurrentWords();

    expect(result).toEqual(null);
    expect(initialiseUser).toHaveBeenCalledTimes(1);
  });
});
