import { v4 } from 'uuid';
import { getUser } from './getUser';
import { getMongoDB } from '../lib/mongoDB';
import { defaultWords, defaultWordSets } from '../constants';
import { getTimeStamp } from '../utils/getTimeStamp';
import { DbUser, NewIdDbUser } from './types';

export async function createUser(userAuthId: string): Promise<DbUser | null> {
  const db = await getMongoDB();

  const users = db.collection('users');

  const uuid = v4();
  const timestamp = getTimeStamp();

  const newUser: NewIdDbUser = {
    userAuthId,
    createdAt: timestamp,
    wordSets: defaultWordSets,
    words: [...defaultWords],
    userPlatformId: uuid,
  };

  newUser.wordSets[0].wordSetId = v4();
  newUser.wordSets[0].createdAt = timestamp;

  await users.insertOne(newUser);
  const newDBUser: DbUser | null = await getUser(userAuthId);
  return newDBUser;
}
