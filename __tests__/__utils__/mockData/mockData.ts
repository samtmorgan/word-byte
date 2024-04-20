import { MockUserType } from '../../../src/types/types';

export const wordSetText = [
  'illogical',
  'illiterate',
  'illegal',
  'illegible',
  'impatient',
  'impractical',
  'disqualify',
  'disobey',
  'incorrect',
  'incomplete',
];

export const mockUserWords = [
  {
    word: 'illogical',
    uuid: '1d4ce9f5-4a58-48ea-a7fe-4a97dda52601',
    owner: 'platform',
  },
  {
    word: 'illiterate',
    uuid: '1c94337d-be0d-409e-a422-5f1576bb9764',
    owner: 'platform',
  },
  {
    word: 'illegal',
    uuid: '2c35689c-bbea-45ff-8245-50d6f9e4f105',
    owner: 'platform',
  },
  {
    word: 'illegible',
    uuid: 'cd7514c8-f2e3-4c8d-a8d7-d5584ce3ee97',
    owner: 'platform',
  },
  {
    word: 'impatient',
    uuid: '583770e4-1356-4639-a17a-342ad43daad9',
    owner: 'platform',
  },
  {
    word: 'impractical',
    uuid: 'e768960c-77ab-4212-a8d7-ef426b1e6201',
    owner: 'platform',
  },
  {
    word: 'disqualify',
    uuid: '065eeef7-b439-4450-8669-d5afc0daf8de',
    owner: 'platform',
  },
  {
    word: 'disobey',
    uuid: '1f6d9fec-f515-448c-b858-564459808183',
    owner: 'platform',
  },
  {
    word: 'incorrect',
    uuid: '3c291577-2883-4bb8-abc9-1ced57cc6dbc',
    owner: 'platform',
  },
  {
    word: 'incomplete',
    uuid: '8db538e0-a490-4fc9-b45f-b809a19668fc',
    owner: 'platform',
  },
];

export const mockUser: MockUserType = {
  name: 'Ginny',
  uuid: 'b8765153-9c08-4301-869c-d810453408ca',
  words: {
    wordSets: [wordSetText],
    attempts: [],
    customWords: mockUserWords,
  },
};
