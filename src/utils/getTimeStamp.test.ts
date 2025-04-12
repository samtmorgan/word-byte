import { getTimeStamp } from './getTimeStamp';

describe('getTimeStamp', () => {
  it('should return a formatted timestamp string', () => {
    const mockDate = new Date('2023-01-01T12:30:45.000Z');
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate.getTime());

    const result = getTimeStamp();

    expect(result).toBe(1672576245000);

    jest.restoreAllMocks();
  });
});
