import { LocalResults } from '../components/review/types';
import { YearGroup } from '../actions/types';

const WORD_REGEX = /^[a-z]+$/i;
const MAX_WORD_LENGTH = 45;
const MAX_WORDS_PER_REQUEST = 50;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_YEAR_GROUPS: YearGroup[] = ['year3_4', 'year5_6'];

export function validateWord(word: unknown): word is string {
  return typeof word === 'string' && word.length > 0 && word.length <= MAX_WORD_LENGTH && WORD_REGEX.test(word);
}

export function validateWordList(words: unknown): words is string[] {
  return Array.isArray(words) && words.length > 0 && words.length <= MAX_WORDS_PER_REQUEST && words.every(validateWord);
}

export function validateUUID(id: unknown): id is string {
  return typeof id === 'string' && UUID_REGEX.test(id);
}

export function validateUUIDList(ids: unknown): ids is string[] {
  return Array.isArray(ids) && ids.every(validateUUID);
}

export function validateLocalResults(results: unknown): results is LocalResults {
  return (
    Array.isArray(results) &&
    results.length > 0 &&
    results.length <= MAX_WORDS_PER_REQUEST &&
    results.every(
      (r: unknown) =>
        typeof r === 'object' &&
        r !== null &&
        'pass' in r &&
        (typeof (r as Record<string, unknown>).pass === 'boolean' || (r as Record<string, unknown>).pass === null) &&
        validateUUID((r as Record<string, unknown>).wordId) &&
        validateWord((r as Record<string, unknown>).word),
    )
  );
}

export function validateYearGroups(groups: unknown): groups is YearGroup[] {
  return (
    Array.isArray(groups) &&
    groups.length > 0 &&
    groups.every((g: unknown) => typeof g === 'string' && (VALID_YEAR_GROUPS as string[]).includes(g))
  );
}
