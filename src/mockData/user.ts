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

import { UserType } from '@/types/types';

export const mockUser: UserType = {
  name: 'Ginny',
  uuid: 'b8765153-9c08-4301-869c-d810453408ca',
  words: [
    {
      word: 'automatic',
      uuid: 'ab7007c1-8a59-470a-84e4-963598f46883',
      owner: 'user',
      current: true,
    },
    // {
    //   word: 'automatically',
    //   uuid: 'b49e8cf7-6d2c-4c9a-b647-d972cfa7bccc',
    //   owner: 'user',
    //   current: true,
    // },
    // {
    //   word: 'automobile',
    //   uuid: 'f4d0b83a-f573-4eb0-b30b-1297f6ab6685',
    //   owner: 'user',
    //   current: true,
    // },
    // {
    //   word: 'autograph',
    //   uuid: '63e248a4-56df-49ba-8e9d-eeca69ee21cc',
    //   owner: 'user',
    //   current: true,
    // },
    // {
    //   word: 'autocue',
    //   uuid: '051290e6-4e83-4a2e-8f5f-4648e024dc9a',
    //   owner: 'user',
    //   current: true,
    // },
    // {
    //   word: 'autopilot',
    //   uuid: 'c642fef7-c799-4f50-9f95-2590c8755d46',
    //   owner: 'user',
    //   current: true,
    // },
    // {
    //   word: 'autobiography',
    //   uuid: 'c3b68ff9-c87a-4c51-ae72-2d04ca7e3eff',
    //   owner: 'user',
    //   current: true,
    // },
    // {
    //   word: 'autobiographies',
    //   uuid: '14016951-2a10-49a5-b733-aedf027755fc',
    //   owner: 'user',
    //   current: true,
    // },
  ],
};
