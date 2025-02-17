import { DbUser, Word, WordOwner } from '../actions/types';
import { LocalResults } from '../components/review/types';

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
  words: [{ word: 'mockWord', wordId: 'mockWordId', owner: WordOwner.PLATFORM, results: [] }],
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
    word: 'breathe',
    wordId: '35f7a198-d160-40ab-ae2e-597c3112ec15',
    owner: 'platform',
    results: [],
  },
  {
    word: 'build',
    wordId: 'f3edfc26-b5ae-4ce7-8b0f-817ee4982d0c',
    owner: 'platform',
    results: [],
  },
];

export const mockLocalResults: LocalResults = [
  {
    word: 'testWord2',
    wordId: 'testWordId2',
    pass: true,
  },
  {
    word: 'testWord3',
    wordId: 'testWordId3',
    pass: null,
  },
];

export const mockUserWords: Word[] = [
  {
    word: 'testWord1',
    wordId: 'testWordId1',
    owner: WordOwner.PLATFORM,
    results: [
      {
        created: 0o0,
        pass: true,
      },
    ],
  },
  {
    word: 'testWord2',
    wordId: 'testWordId2',
    owner: WordOwner.PLATFORM,
    results: [
      {
        created: 0o0,
        pass: false,
      },
    ],
  },
  {
    word: 'testWord3',
    wordId: 'testWordId3',
    owner: WordOwner.PLATFORM,
    results: [],
  },
];
// ~;~~~ current above /\
