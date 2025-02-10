import { DbUser } from '../actions/getUser';
import { MockUserType } from '../types/types';

// ~~~~ current below \/

export const mockAuthUserId = 'auth123';
export const mockUsername = 'testUser';
export const mockDbUser: DbUser = {
  _id: '1',
  userAuthId: mockAuthUserId,
  userPlatformId: 'platform123',
  createdAt: 1735938406366,
  wordSets: [
    {
      wordSetId: 'mockWordSetId',
      createdAt: 123,
      wordIds: ['mockWordId'],
    },
  ],
  words: [{ word: 'mockWord', wordId: 'mockWordId', owner: 'platform', results: [] }],
};

export const mockUser = {
  ...mockDbUser,
  username: mockUsername,
};

export const mockCurrentWords = [
  {
    word: 'accident',
    wordId: 'd659c3a4-4ea2-4619-b4da-53b6550d925f',
    owner: 'platform',
    results: [],
  },
  {
    word: 'accidentally',
    wordId: 'b02b5c18-1ed6-40e5-bf4b-dc268a1b8866',
    owner: 'platform',
    results: [],
  },
  {
    word: 'actual',
    wordId: 'e13e18b1-7c04-4dae-8a02-6898848d168b',
    owner: 'platform',
    results: [],
  },
  {
    word: 'actually',
    wordId: '1ed7098e-e2a7-4607-940c-cdb7f49b3bc0',
    owner: 'platform',
    results: [],
  },
  {
    word: 'address',
    wordId: '8ec8b1ff-50a1-4152-bae2-01ff3e5450ad',
    owner: 'platform',
    results: [],
  },
  {
    word: 'answer',
    wordId: 'fbc6c6b1-df0b-4015-94c9-01207ceb4471',
    owner: 'platform',
    results: [],
  },
  {
    word: 'believe',
    wordId: '26dd4d7a-045c-4103-8461-1466bd4b84c1',
    owner: 'platform',
    results: [],
  },
  {
    word: 'bicycle',
    wordId: 'a86b4f9e-7027-4940-9345-fed0951c87b0',
    owner: 'platform',
    results: [],
  },
  {
    word: 'believe',
    wordId: '26dd4d7a-045c-4103-8461-1466bd4b84c1',
    owner: 'platform',
    results: [],
  },
  {
    word: 'bicycle',
    wordId: 'a86b4f9e-7027-4940-9345-fed0951c87b0',
    owner: 'platform',
    results: [],
  },
];

// ~;~~~ current above /\

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

export const oldMockUser: MockUserType = {
  name: 'Ginny',
  uuid: 'b8765153-9c08-4301-869c-d810453408ca',
  words: {
    wordSets: [wordSetText],
    attempts: [],
    customWords: mockUserWords,
  },
};

export const mockTestWords = [
  'recommend',
  'relevant',
  'restaurant',
  'rhyme',
  'rhythm',
  'sacrifice',
  'secretary',
  'shoulder',
  'signature',
  'sincere',
];
