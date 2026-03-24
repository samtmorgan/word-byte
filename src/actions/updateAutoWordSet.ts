'use server';

import { getMongoDB } from '../lib/mongoDB';
import { AutoConfig } from './types';

type UpdateAutoWordSetProps = {
  autoWordSet: string[];
  userPlatformId: string;
  autoConfig?: AutoConfig;
};

export async function updateAutoWordSet({
  autoWordSet,
  userPlatformId,
  autoConfig,
}: UpdateAutoWordSetProps): Promise<void> {
  const db = await getMongoDB();
  const users = db.collection('users');

  const setFields: Record<string, unknown> = { autoWordSet };
  if (autoConfig) {
    setFields.autoConfig = autoConfig;
  }

  await users.updateOne({ userPlatformId }, { $set: setFields });
}
