import { MockUserType } from '../types/types';
import { userWords } from './words';

/**
 * Mock user data for adult user account that can have more than one child account
 * this adds complexity to the app structure and might be implemented later
 */
// export const user = {
//   name: 'Albus',
//   uuid: '3ec89b56-2de6-4ef1-a7ad-9b2b91562e6c',
//   children: [
//     // array of children who use the adults account
//     {
//       name: 'Ginny',
//       uuid: 'b8765153-9c08-4301-869c-d810453408ca',
//       words: {
//         current: [], // array of word uuids??
//         history: [
//           {
//             uuid: '', // word uuid
//             attempts: [
//               {
//                 timestamp: 0, // timestamp of the attempt
//                 pass: true, // true = successful, false = unsuccessful
//               },
//             ],
//           },
//         ],
//       },
//     },
//   ],
// };

// const wordSetUuids = [
//   'ab7007c1-8a59-470a-84e4-963598f46883',
//   'b49e8cf7-6d2c-4c9a-b647-d972cfa7bccc',
//   'f4d0b83a-f573-4eb0-b30b-1297f6ab6685',
//   '63e248a4-56df-49ba-8e9d-eeca69ee21cc',
//   '051290e6-4e83-4a2e-8f5f-4648e024dc9a',
//   'c642fef7-c799-4f50-9f95-2590c8755d46',
//   'c3b68ff9-c87a-4c51-ae72-2d04ca7e3eff',
//   '14016951-2a10-49a5-b733-aedf027755fc',
// ];

// const wordSetText = [
//   'automatic',
//   'automatically',
//   'automobile',
//   'autograph',
//   'autocue',
//   'autopilot',
//   'autobiography',
//   'autobiographies',
// ];

// const wordSetText = [
//   'adventure',
//   'celebrate',
//   'excellent',
//   'familiar',
//   'hygiene',
//   'leisure',
//   'occasion',
//   'recommend',
//   'temperature',
//   'unusual',
// ];

// const wordSetText = [
//   'international',
//   'interact',
//   'intermediate',
//   'Internet',
//   'supermarket',
//   'submarine',
//   'antifreeze',
//   'intercity',
//   'intergalactic',
//   'interrelate',
// ];

// const wordSetText = [
//   'courageous',
//   'outrageous',
//   'poisonous',
//   'humorous',
//   'glamorous',
//   'mountainous',
//   'obvious',
//   'anxious',
//   'jealous',
//   'serious',
// ];

// const wordSetText = [
//   'illogical',
//   'illiterate',
//   'illegal',
//   'illegible',
//   'impatient',
//   'impractical',
//   'disqualify',
//   'disobey',
//   'incorrect',
//   'incomplete',
// ];

// const wordSetText = [
//   'unique',
//   'cheque',
//   'antique',
//   'grotesque',
//   'fatigue',
//   'colleague',
//   'catalogue',
//   'dialogue',
//   'league',
// ];

// const wordSetText = [
//   'Early',
//   'Particular',
//   'Weight',
//   'Thought',
//   'February',
//   'Knowledge',
//   'Library',
//   'Unfamiliar',
//   'Favourite',
//   'Certain',
// ];

// const wordSetText = [
//   'relevant',
//   'irrelevant',
//   'regular',
//   'irregular',
//   'resistible',
//   'irresistible',
//   'responsible',
//   'irresponsible',
// ];

// const wordSetText = [
//   'unfair',
//   'disagree',
//   'impractical',
//   'illogical',
//   'misspell',
//   'impatient',
//   'disappear',
//   'irresponsible',
//   'imperfect',
//   'disconnect',
// ];

// const wordSetText = [
//   'possession',
//   'expression',
//   'confession',
//   'progression',
//   'discussion',
//   'impression',
//   'admission',
//   'permission',
//   'transmission',
//   'submission',
// ];

// const wordSetText = [
//   'accommodate',
//   'accompany',
//   'according',
//   'achieve',
//   'aggressive',
//   'amateur',
//   'ancient',
//   'apparent',
//   'appreciate',
//   'attached',
// ];

// const wordSetText = [
//   'available',
//   'average',
//   'awkward',
//   'bargain',
//   'bruise',
//   'category',
//   'cemetery',
//   'committee',
//   'communicate',
//   'community',
// ];

// const wordSetText = [
//   'competition',
//   'conscience',
//   'conscious',
//   'controversy',
//   'convenience',
//   'correspond',
//   'criticise',
//   'curiosity',
//   'definite',
//   'desperate',
// ];

// const wordSetText = [
//   'determined',
//   'develop',
//   'dictionary',
//   'disastrous',
//   'embarrass',
//   'environment',
//   'equip',
//   'equipped',
//   'equipment',
//   'especially',
// ];

// const wordSetText = [
//   'Exaggerate',
//   'Excellent',
//   'existence',
//   'explanation',
//   'familiar',
//   'foreign',
//   'forty',
//   'frequently',
//   'government',
//   'guarantee',
// ];

// const wordSetText = [
//   'harass',
//   'hindrance',
//   'identity',
//   'immediate',
//   'immediately',
//   'individual',
//   'interfere',
//   'interrupt',
//   'language',
//   'leisure',
// ];

// const wordSetText = [
//   'lightning',
//   'marvellous',
//   'mischievous',
//   'muscle',
//   'necessary',
//   'neighbour',
//   'nuisance',
//   'occupy',
//   'occur',
//   'opportunity',
// ];

// const wordSetText = [
//   'parliament',
//   'persuade',
//   'physical',
//   'prejudice',
//   'privilege',
//   'profession',
//   'programme',
//   'pronunciation',
//   'queue',
//   'recognise',
// ];

const wordSetText = [
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
export const mockUser: MockUserType = {
  name: 'Ginny',
  uuid: 'b8765153-9c08-4301-869c-d810453408ca',
  words: {
    wordSets: [wordSetText],
    attempts: [],
    customWords: userWords,
  },
};

//   words: [
//     {
//       word: 'automatic',
//       uuid: 'ab7007c1-8a59-470a-84e4-963598f46883',
//       owner: 'user',
//       current: true,
//     },
//     {
//       word: 'automatically',
//       uuid: 'b49e8cf7-6d2c-4c9a-b647-d972cfa7bccc',
//       owner: 'user',
//       current: true,
//     },
//     {
//       word: 'automobile',
//       uuid: 'f4d0b83a-f573-4eb0-b30b-1297f6ab6685',
//       owner: 'user',
//       current: true,
//     },
//     {
//       word: 'autograph',
//       uuid: '63e248a4-56df-49ba-8e9d-eeca69ee21cc',
//       owner: 'user',
//       current: true,
//     },
//     {
//       word: 'autocue',
//       uuid: '051290e6-4e83-4a2e-8f5f-4648e024dc9a',
//       owner: 'user',
//       current: true,
//     },
//     {
//       word: 'autopilot',
//       uuid: 'c642fef7-c799-4f50-9f95-2590c8755d46',
//       owner: 'user',
//       current: true,
//     },
//     {
//       word: 'autobiography',
//       uuid: 'c3b68ff9-c87a-4c51-ae72-2d04ca7e3eff',
//       owner: 'user',
//       current: true,
//     },
//     {
//       word: 'autobiographies',
//       uuid: '14016951-2a10-49a5-b733-aedf027755fc',
//       owner: 'user',
//       current: true,
//     },
//   ],

/**
words pool - the standard words that are available to all users
    {
        word: 'autobiographies',
        uuid: '14016951-2a10-49a5-b733-aedf027755fc',
        owner: 'pool',
    }[]

user.words.customWords - the words that the user has added
    {
        word: 'autobiographies',
        uuid: '14016951-2a10-49a5-b733-aedf027755fc',
        owner: 'user',
    }[]

user.words.attempts - the words that the user has already learnt
    {
        uuid: '14016951-2a10-49a5-b733-aedf027755fc',
        attempts: [
            {
                timestamp: 0,
                pass: true,
            },
        ],
    }[],
    wordSets: word[][]
}
*/

type TUser = {
  userId: string;
  userAuthId: string;
  createdAt: number;
  practice: {
    createdAt: number;
    results: {
      wordId: string;
      pass: boolean;
    }[];
  }[];
  wordSets: {
    wordSetId: string;
    createdAt: number;
    wordIds: string[];
  }[];
  words: {
    wordId: string;
    word: string;
    owner: 'platform' | 'user';
    results: {
      createdAt: number;
      pass: boolean;
    }[];
  }[];
};

export const user: TUser = {
  userId: '5c6e4f5b-18dc-4902-932c-2e00062018bc',
  userAuthId: 'clerk id',
  createdAt: 1735938406366,
  practice: [],
  wordSets: [],
  words: [
    {
      word: 'automatic',
      wordId: 'ab7007c1-8a59-470a-84e4-963598f46883',
      owner: 'platform',
      results: [],
    },
  ],
};
