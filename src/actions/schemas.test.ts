import {
  addUserWordSchema,
  addWordListSchema,
  addTestResultsSchema,
  createWordListSchema,
  deleteUserWordSchema,
  deleteWordListSchema,
  promoteWordListSchema,
  updateAutoConfigSchema,
  updateUserModeSchema,
  MAX_WORD_LENGTH,
  MAX_WORDS_ARRAY_LENGTH,
  MAX_RESULTS_ARRAY_LENGTH,
} from './schemas';

const VALID_UUID = '00000000-0000-4000-8000-000000000001';

describe('schemas', () => {
  describe('addUserWordSchema', () => {
    it('accepts valid word', () => {
      expect(addUserWordSchema.safeParse('hello').success).toBe(true);
    });

    it('trims whitespace', () => {
      const result = addUserWordSchema.safeParse('  hello  ');
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toBe('hello');
    });

    it('rejects empty string', () => {
      expect(addUserWordSchema.safeParse('').success).toBe(false);
    });

    it('rejects whitespace-only', () => {
      expect(addUserWordSchema.safeParse('   ').success).toBe(false);
    });

    it('rejects word exceeding max length', () => {
      expect(addUserWordSchema.safeParse('a'.repeat(MAX_WORD_LENGTH + 1)).success).toBe(false);
    });

    it('accepts word at max length', () => {
      expect(addUserWordSchema.safeParse('a'.repeat(MAX_WORD_LENGTH)).success).toBe(true);
    });
  });

  describe('addWordListSchema', () => {
    it('accepts valid word array', () => {
      expect(addWordListSchema.safeParse(['hello', 'world']).success).toBe(true);
    });

    it('rejects empty array', () => {
      expect(addWordListSchema.safeParse([]).success).toBe(false);
    });

    it('rejects array with empty string', () => {
      expect(addWordListSchema.safeParse(['']).success).toBe(false);
    });

    it('rejects oversized array', () => {
      const arr = Array(MAX_WORDS_ARRAY_LENGTH + 1).fill('word');
      expect(addWordListSchema.safeParse(arr).success).toBe(false);
    });

    it('accepts array at max length', () => {
      const arr = Array(MAX_WORDS_ARRAY_LENGTH).fill('word');
      expect(addWordListSchema.safeParse(arr).success).toBe(true);
    });
  });

  describe('addTestResultsSchema', () => {
    const validResult = { pass: true, wordId: VALID_UUID, word: 'test' };

    it('accepts valid input', () => {
      expect(addTestResultsSchema.safeParse({ localResults: [validResult] }).success).toBe(true);
    });

    it('accepts null pass value', () => {
      expect(addTestResultsSchema.safeParse({ localResults: [{ ...validResult, pass: null }] }).success).toBe(true);
    });

    it('defaults isAutoMode to false', () => {
      const result = addTestResultsSchema.safeParse({ localResults: [validResult] });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.isAutoMode).toBe(false);
    });

    it('rejects empty results', () => {
      expect(addTestResultsSchema.safeParse({ localResults: [] }).success).toBe(false);
    });

    it('rejects invalid wordId', () => {
      expect(addTestResultsSchema.safeParse({ localResults: [{ ...validResult, wordId: 'bad' }] }).success).toBe(false);
    });

    it('rejects oversized results', () => {
      const arr = Array(MAX_RESULTS_ARRAY_LENGTH + 1).fill(validResult);
      expect(addTestResultsSchema.safeParse({ localResults: arr }).success).toBe(false);
    });
  });

  describe('createWordListSchema', () => {
    it('accepts valid input with selectedWordIds', () => {
      expect(createWordListSchema.safeParse({ selectedWordIds: [VALID_UUID], newWordTexts: [] }).success).toBe(true);
    });

    it('accepts valid input with newWordTexts', () => {
      expect(createWordListSchema.safeParse({ selectedWordIds: [], newWordTexts: ['hello'] }).success).toBe(true);
    });

    it('rejects when both arrays empty', () => {
      expect(createWordListSchema.safeParse({ selectedWordIds: [], newWordTexts: [] }).success).toBe(false);
    });

    it('rejects invalid UUID in selectedWordIds', () => {
      expect(createWordListSchema.safeParse({ selectedWordIds: ['bad'], newWordTexts: [] }).success).toBe(false);
    });
  });

  describe('UUID schemas', () => {
    it.each([
      ['deleteUserWordSchema', deleteUserWordSchema],
      ['deleteWordListSchema', deleteWordListSchema],
      ['promoteWordListSchema', promoteWordListSchema],
    ])('%s accepts valid UUID', (_, schema) => {
      expect(schema.safeParse(VALID_UUID).success).toBe(true);
    });

    it.each([
      ['deleteUserWordSchema', deleteUserWordSchema],
      ['deleteWordListSchema', deleteWordListSchema],
      ['promoteWordListSchema', promoteWordListSchema],
    ])('%s rejects invalid UUID', (_, schema) => {
      expect(schema.safeParse('not-a-uuid').success).toBe(false);
    });
  });

  describe('updateAutoConfigSchema', () => {
    it('accepts valid config', () => {
      expect(updateAutoConfigSchema.safeParse({ yearGroups: ['year3_4'], includeUserWords: false }).success).toBe(true);
    });

    it('rejects empty yearGroups', () => {
      expect(updateAutoConfigSchema.safeParse({ yearGroups: [], includeUserWords: false }).success).toBe(false);
    });

    it('rejects invalid yearGroup', () => {
      expect(updateAutoConfigSchema.safeParse({ yearGroups: ['year7_8'], includeUserWords: false }).success).toBe(
        false,
      );
    });

    it('rejects missing includeUserWords', () => {
      expect(updateAutoConfigSchema.safeParse({ yearGroups: ['year3_4'] }).success).toBe(false);
    });
  });

  describe('updateUserModeSchema', () => {
    it('accepts valid input', () => {
      expect(updateUserModeSchema.safeParse({ userPlatformId: VALID_UUID, mode: 'auto' }).success).toBe(true);
    });

    it('accepts with autoConfig', () => {
      expect(
        updateUserModeSchema.safeParse({
          userPlatformId: VALID_UUID,
          mode: 'manual',
          autoConfig: { yearGroups: ['year5_6'], includeUserWords: true },
        }).success,
      ).toBe(true);
    });

    it('rejects invalid mode', () => {
      expect(updateUserModeSchema.safeParse({ userPlatformId: VALID_UUID, mode: 'invalid' }).success).toBe(false);
    });

    it('rejects invalid UUID', () => {
      expect(updateUserModeSchema.safeParse({ userPlatformId: 'bad', mode: 'auto' }).success).toBe(false);
    });
  });
});
