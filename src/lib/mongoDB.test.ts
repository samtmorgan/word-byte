import { getMongoDB } from './mongoDB';

jest.mock('./mongoClient', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
  },
}));

describe('getMongoDB', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('should throw when MONGODB_DB env var is missing', async () => {
    delete process.env.MONGODB_DB;

    await expect(getMongoDB()).rejects.toThrow('Invalid/Missing environment variable: "MONGODB_DB"');
  });

  it('should return the database when MONGODB_DB is set', async () => {
    process.env.MONGODB_DB = 'testdb';

    const mockDb = {};
    const mockMongoClient = { db: jest.fn().mockReturnValue(mockDb) };

    const client = require('./mongoClient').default;
    (client.connect as jest.Mock).mockResolvedValue(mockMongoClient);

    const result = await getMongoDB();

    expect(client.connect).toHaveBeenCalled();
    expect(mockMongoClient.db).toHaveBeenCalledWith('testdb');
    expect(result).toBe(mockDb);
  });
});
