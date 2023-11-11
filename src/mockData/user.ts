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
      word: 'cheekily',
      uuid: 'a288df55-5d7a-41d4-aaa5-3f881984307d',
      owner: 'user',
      current: true,
    },
    {
      word: 'angrily',
      uuid: 'f54b7a85-2631-4b87-b5b5-488034b2ba2c',
      owner: 'user',
      current: true,
    },
    {
      word: 'heavily',
      uuid: 'd4a66930-6a4f-4b58-ad23-85aa6b0ab7fd',
      owner: 'user',
      current: true,
    },
    {
      word: 'heroically',
      uuid: '023a598d-0350-4fd9-bde1-9778f2b7de47',
      owner: 'user',
      current: true,
    },
    {
      word: 'magically',
      uuid: 'c1a1fafd-b52d-437e-9120-072fbbba08f8',
      owner: 'user',
      current: true,
    },
    {
      word: 'automatically',
      uuid: 'a56e3444-b01e-49a7-971a-a1ad3ce120c3',
      owner: 'user',
      current: true,
    },
    {
      word: 'bossily',
      uuid: '3d06afd5-8b04-49a1-bbd0-5a287b18e504',
      owner: 'user',
      current: true,
    },
    {
      word: 'comically',
      uuid: 'dc9e96f4-8cce-46ab-be9e-7fb6cf22c8a5',
      owner: 'user',
      current: true,
    },
    {
      word: 'physically',
      uuid: '6f056e79-ea89-4242-a4eb-f0a7ee9bba27',
      owner: 'user',
      current: true,
    },
    {
      word: 'finally',
      uuid: '51cffed0-5a13-46a7-b2cd-998828ab62b8',
      owner: 'user',
      current: true,
    },

    // {
    //   word: 'automatic',
    //   uuid: 'ab7007c1-8a59-470a-84e4-963598f46883',
    //   owner: 'user',
    //   current: true,
    // },
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
