import { z } from 'zod';

// === Size caps ===
export const MAX_WORD_LENGTH = 100;
export const MAX_WORDS_ARRAY_LENGTH = 500;
export const MAX_RESULTS_ARRAY_LENGTH = 500;
export const MAX_WORD_IDS_ARRAY_LENGTH = 500;
export const MAX_NEW_WORD_TEXTS_LENGTH = 200;

// === Reusable primitives ===
const wordString = z
  .string()
  .trim()
  .min(1, 'Word cannot be empty')
  .max(MAX_WORD_LENGTH, `Word exceeds ${MAX_WORD_LENGTH} characters`);

const uuidString = z.string().uuid('Invalid ID format');

const yearGroup = z.enum(['year3_4', 'year5_6']);

// === Per-action schemas ===

export const addUserWordSchema = wordString;

export const addWordListSchema = z
  .array(wordString)
  .min(1, 'Word list cannot be empty')
  .max(MAX_WORDS_ARRAY_LENGTH, `Word list exceeds ${MAX_WORDS_ARRAY_LENGTH} items`);

const localResultItem = z.object({
  pass: z.boolean().nullable(),
  wordId: z.string().min(1, 'Word ID cannot be empty'),
  word: z.string().min(1),
});

export const addTestResultsSchema = z.object({
  localResults: z
    .array(localResultItem)
    .min(1, 'Results cannot be empty')
    .max(MAX_RESULTS_ARRAY_LENGTH, `Results exceed ${MAX_RESULTS_ARRAY_LENGTH} items`),
  isAutoMode: z.boolean().optional().default(false),
});

export const createWordListSchema = z
  .object({
    selectedWordIds: z.array(uuidString).max(MAX_WORD_IDS_ARRAY_LENGTH),
    newWordTexts: z.array(wordString).max(MAX_NEW_WORD_TEXTS_LENGTH),
  })
  .refine(d => d.selectedWordIds.length + d.newWordTexts.length > 0, {
    message: 'Must provide at least one word',
  });

export const deleteUserWordSchema = uuidString;

export const deleteWordListSchema = uuidString;

export const promoteWordListSchema = uuidString;

const autoConfigSchema = z.object({
  yearGroups: z.array(yearGroup).min(1, 'Must select at least one year group'),
  includeUserWords: z.boolean(),
});

export const updateAutoConfigSchema = autoConfigSchema;

const autoConfigPartialSchema = z.object({
  yearGroups: z.array(yearGroup),
  includeUserWords: z.boolean().optional(),
});

export const updateUserModeSchema = z.object({
  userPlatformId: uuidString,
  mode: z.enum(['auto', 'manual']),
  autoConfig: autoConfigPartialSchema.optional(),
});
