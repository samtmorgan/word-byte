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
    word: 'testWord1',
    wordId: 'testWordId1',
    owner: WordOwner.PLATFORM,
    results: [],
  },
  {
    word: 'testWord2',
    wordId: 'testWordId2',
    owner: WordOwner.PLATFORM,
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
