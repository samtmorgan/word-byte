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
      word: 'accident',
      uuid: 'd659c3a4-4ea2-4619-b4da-53b6550d925f',
      owner: 'platform',
      current: true,
    },
    {
      word: 'accidentally',
      uuid: 'b02b5c18-1ed6-40e5-bf4b-dc268a1b8866',
      owner: 'platform',
      current: true,
    },
  ],
};
