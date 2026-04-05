import {
  validateWord,
  validateWordList,
  validateUUID,
  validateUUIDList,
  validateLocalResults,
  validateYearGroups,
} from './validation';

const VALID_UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('validateWord', () => {
  it('returns true for a valid lowercase word', () => {
    expect(validateWord('hello')).toBe(true);
  });

  it('returns true for a valid uppercase word', () => {
    expect(validateWord('Hello')).toBe(true);
  });

  it('returns true for a word at max length (45 chars)', () => {
    expect(validateWord('a'.repeat(45))).toBe(true);
  });

  it('returns false for an empty string', () => {
    expect(validateWord('')).toBe(false);
  });

  it('returns false for a word exceeding max length', () => {
    expect(validateWord('a'.repeat(46))).toBe(false);
  });

  it('returns false for a word with numbers', () => {
    expect(validateWord('hello1')).toBe(false);
  });

  it('returns false for a word with special characters', () => {
    expect(validateWord('hello!')).toBe(false);
  });

  it('returns false for a word with spaces', () => {
    expect(validateWord('hello world')).toBe(false);
  });

  it('returns false for a non-string type (number)', () => {
    expect(validateWord(42)).toBe(false);
  });

  it('returns false for null', () => {
    expect(validateWord(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(validateWord(undefined)).toBe(false);
  });
});

describe('validateWordList', () => {
  it('returns true for a valid array of words', () => {
    expect(validateWordList(['apple', 'banana', 'cherry'])).toBe(true);
  });

  it('returns false for an empty array', () => {
    expect(validateWordList([])).toBe(false);
  });

  it('returns false for an array exceeding max size (50)', () => {
    expect(validateWordList(Array(51).fill('word'))).toBe(false);
  });

  it('returns true for an array of exactly 50 words', () => {
    expect(validateWordList(Array(50).fill('word'))).toBe(true);
  });

  it('returns false for an array containing an invalid word', () => {
    expect(validateWordList(['apple', 'invalid!', 'cherry'])).toBe(false);
  });

  it('returns false for a non-array value', () => {
    expect(validateWordList('notanarray')).toBe(false);
  });

  it('returns false for null', () => {
    expect(validateWordList(null)).toBe(false);
  });
});

describe('validateUUID', () => {
  it('returns true for a valid UUID v4', () => {
    expect(validateUUID(VALID_UUID)).toBe(true);
  });

  it('returns true for a UUID with uppercase letters', () => {
    expect(validateUUID('123E4567-E89B-12D3-A456-426614174000')).toBe(true);
  });

  it('returns false for a non-string type', () => {
    expect(validateUUID(12345)).toBe(false);
  });

  it('returns false for a malformed UUID (too short)', () => {
    expect(validateUUID('123e4567-e89b-12d3-a456')).toBe(false);
  });

  it('returns false for a malformed UUID (wrong format)', () => {
    expect(validateUUID('not-a-valid-uuid-string')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(validateUUID('')).toBe(false);
  });

  it('returns false for null', () => {
    expect(validateUUID(null)).toBe(false);
  });
});

describe('validateUUIDList', () => {
  it('returns true for a valid array of UUIDs', () => {
    expect(validateUUIDList([VALID_UUID, '987fbc97-4bed-5078-af07-9141ba07c9f3'])).toBe(true);
  });

  it('returns true for an empty array', () => {
    expect(validateUUIDList([])).toBe(true);
  });

  it('returns false for an array containing an invalid UUID', () => {
    expect(validateUUIDList([VALID_UUID, 'not-a-uuid'])).toBe(false);
  });

  it('returns false for a non-array value', () => {
    expect(validateUUIDList(VALID_UUID)).toBe(false);
  });
});

describe('validateLocalResults', () => {
  const validResult = { pass: true, wordId: VALID_UUID, word: 'hello' };
  const nullPassResult = { pass: null, wordId: VALID_UUID, word: 'hello' };
  const falsePassResult = { pass: false, wordId: VALID_UUID, word: 'hello' };

  it('returns true for a valid results array', () => {
    expect(validateLocalResults([validResult])).toBe(true);
  });

  it('returns true when pass is null', () => {
    expect(validateLocalResults([nullPassResult])).toBe(true);
  });

  it('returns true when pass is false', () => {
    expect(validateLocalResults([falsePassResult])).toBe(true);
  });

  it('returns true for a mixed array', () => {
    expect(validateLocalResults([validResult, nullPassResult, falsePassResult])).toBe(true);
  });

  it('returns false for an empty array', () => {
    expect(validateLocalResults([])).toBe(false);
  });

  it('returns false for an array exceeding max size (50)', () => {
    expect(validateLocalResults(Array(51).fill(validResult))).toBe(false);
  });

  it('returns false when pass is a string', () => {
    expect(validateLocalResults([{ pass: 'yes', wordId: VALID_UUID, word: 'hello' }])).toBe(false);
  });

  it('returns false when wordId is not a valid UUID', () => {
    expect(validateLocalResults([{ pass: true, wordId: 'not-a-uuid', word: 'hello' }])).toBe(false);
  });

  it('returns false when word fails validation', () => {
    expect(validateLocalResults([{ pass: true, wordId: VALID_UUID, word: 'hello!' }])).toBe(false);
  });

  it('returns false when pass field is missing', () => {
    expect(validateLocalResults([{ wordId: VALID_UUID, word: 'hello' }])).toBe(false);
  });

  it('returns false for a non-array value', () => {
    expect(validateLocalResults(validResult)).toBe(false);
  });

  it('returns false for null', () => {
    expect(validateLocalResults(null)).toBe(false);
  });
});

describe('validateYearGroups', () => {
  it('returns true for valid year groups', () => {
    expect(validateYearGroups(['year3_4', 'year5_6'])).toBe(true);
  });

  it('returns true for a single valid year group', () => {
    expect(validateYearGroups(['year3_4'])).toBe(true);
  });

  it('returns false for an empty array', () => {
    expect(validateYearGroups([])).toBe(false);
  });

  it('returns false for an invalid year group value', () => {
    expect(validateYearGroups(['year1_2'])).toBe(false);
  });

  it('returns false for a mixed array of valid and invalid', () => {
    expect(validateYearGroups(['year3_4', 'year1_2'])).toBe(false);
  });

  it('returns false for non-string values in the array', () => {
    expect(validateYearGroups([1, 2])).toBe(false);
  });

  it('returns false for a non-array value', () => {
    expect(validateYearGroups('year3_4')).toBe(false);
  });

  it('returns false for null', () => {
    expect(validateYearGroups(null)).toBe(false);
  });
});
