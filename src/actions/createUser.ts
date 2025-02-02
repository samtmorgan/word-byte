import { v4 } from 'uuid';
import { DbUser, getUser } from './getUser';
import { getMongoDB } from '../lib/mongoDB';
import { defaultWords } from '../constants';

type NewIdDbUser = Omit<DbUser, '_id'>;

export async function createUser(userAuthId: string): Promise<DbUser | null> {
  const db = await getMongoDB();

  const users = db.collection('users');

  const uuid = v4();
  const timestamp = Date.now();

  const newUser: NewIdDbUser = {
    userAuthId,
    createdAt: timestamp,
    wordSets: [],
    words: [...defaultWords],
    userPlatformId: uuid,
  };

  await users.insertOne(newUser);
  const newDBUser: DbUser | null = await getUser(userAuthId);
  return newDBUser;
}
