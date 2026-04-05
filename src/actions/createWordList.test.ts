import { v4 as uuidv4 } from 'uuid';
import { createWordList } from './createWordList';
import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { WordOwner } from './types';
import { mockUser } from '../testUtils/mockData';
import { getTimeStamp } from '../utils/getTimeStamp';

const VALID_UUID_1 = '123e4567-e89b-12d3-a456-426614174000';

jest.mock('./initUser.ts', () => ({
  initialiseUser: jest.fn(),
}));
jest.mock('./updateUserWordsAndWordSets', () => ({
  updateUserWordsAndWordSets: jest.fn(),
}));
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));
jest.mock('../utils/getTimeStamp', () => ({
  getTimeStamp: jest.fn(),
}));

describe('createWordList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue('generated-id');
    (getTimeStamp as jest.Mock).mockReturnValue(1000);
  });

  it('throws error when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    await expect(createWordList([], ['hello'])).rejects.toThrow("couldn't initialise user");
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('creates new word objects for words that do not exist', async () => {
    const user = { ...mockUser, words: [], wordSets: [] };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await createWordList([], ['hello']);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith(
      expect.objectContaining({
        words: [{ word: 'hello', wordId: 'generated-id', owner: WordOwner.USER, results: [] }],
      }),
    );
  });

  it('deduplicates new words against existing words (case-insensitive)', async () => {
    const existingWord = { word: 'Hello', wordId: 'existing-id', owner: WordOwner.PLATFORM, results: [] };
    const user = { ...mockUser, words: [existingWord], wordSets: [] };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await createWordList([], ['hello']);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith(
      expect.objectContaining({
        words: [existingWord],
        wordSets: expect.arrayContaining([
          expect.objectContaining({ wordIds: expect.arrayContaining(['existing-id']) }),
        ]),
      }),
    );
  });

  it('combines selected, new, and existing word IDs', async () => {
    const user = { ...mockUser, words: [], wordSets: [] };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await createWordList([VALID_UUID_1], ['newword']);

    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith(
      expect.objectContaining({
        wordSets: expect.arrayContaining([
          expect.objectContaining({ wordIds: expect.arrayContaining([VALID_UUID_1, 'generated-id']) }),
        ]),
      }),
    );
  });

  it('prepends the new word set to existing word sets', async () => {
    const user = { ...mockUser };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    await createWordList([VALID_UUID_1], []);

    const call = (updateUserWordsAndWordSets as jest.Mock).mock.calls[0][0];
    expect(call.wordSets[0].wordSetId).toBe('generated-id');
    expect(call.wordSets.length).toBe(user.wordSets.length + 1);
  });

  it('throws error when both selectedWordIds and newWordTexts are empty', async () => {
    await expect(createWordList([], [])).rejects.toThrow('At least one word or existing word ID is required');
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });
});
