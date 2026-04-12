import { v4 as uuidv4 } from 'uuid';
import { createWordList } from './createWordList';
import { initialiseUser } from './initUser';
import { updateUserWordsAndWordSets } from './updateUserWordsAndWordSets';
import { WordOwner } from './types';
import { mockUser } from '../testUtils/mockData';
import { getTimeStamp } from '../utils/getTimeStamp';

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

const UUID_SELECTED = '00000000-0000-4000-8000-000000000001';

describe('createWordList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue('generated-id');
    (getTimeStamp as jest.Mock).mockReturnValue(1000);
  });

  it('returns INIT_FAILED when user cannot be initialized', async () => {
    (initialiseUser as jest.Mock).mockResolvedValue(null);

    const result = await createWordList({ selectedWordIds: [], newWordTexts: ['hello'] });

    expect(result).toEqual({ success: false, code: 'INIT_FAILED', error: expect.any(String) });
    expect(updateUserWordsAndWordSets).not.toHaveBeenCalled();
  });

  it('returns VALIDATION_ERROR when both arrays are empty', async () => {
    const result = await createWordList({ selectedWordIds: [], newWordTexts: [] });

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
    expect(initialiseUser).not.toHaveBeenCalled();
  });

  it('returns VALIDATION_ERROR for invalid UUID in selectedWordIds', async () => {
    const result = await createWordList({ selectedWordIds: ['not-a-uuid'], newWordTexts: [] });

    expect(result).toEqual({ success: false, code: 'VALIDATION_ERROR', error: expect.any(String) });
  });

  it('creates new word objects for words that do not exist', async () => {
    const user = { ...mockUser, words: [], wordSets: [] };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    const result = await createWordList({ selectedWordIds: [], newWordTexts: ['hello'] });

    expect(result).toEqual({ success: true, data: undefined });
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

    const result = await createWordList({ selectedWordIds: [], newWordTexts: ['hello'] });

    expect(result).toEqual({ success: true, data: undefined });
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

    const result = await createWordList({ selectedWordIds: [UUID_SELECTED], newWordTexts: ['newword'] });

    expect(result).toEqual({ success: true, data: undefined });
    expect(updateUserWordsAndWordSets).toHaveBeenCalledWith(
      expect.objectContaining({
        wordSets: expect.arrayContaining([
          expect.objectContaining({ wordIds: expect.arrayContaining([UUID_SELECTED, 'generated-id']) }),
        ]),
      }),
    );
  });

  it('prepends the new word set to existing word sets', async () => {
    const user = { ...mockUser };
    (initialiseUser as jest.Mock).mockResolvedValue(user);

    const result = await createWordList({ selectedWordIds: [UUID_SELECTED], newWordTexts: [] });

    expect(result).toEqual({ success: true, data: undefined });
    const call = (updateUserWordsAndWordSets as jest.Mock).mock.calls[0][0];
    expect(call.wordSets[0].wordSetId).toBe('generated-id');
    expect(call.wordSets.length).toBe(user.wordSets.length + 1);
  });
});
