'use server';

import { getMongoDB } from '../lib/mongoDB';
import { AutoConfig } from './types';

type UpdateAutoWordSetProps = {
  autoWordSet: string[];
  userPlatformId: string;
  autoConfig?: AutoConfig;
  dataVersion?: number;
};

export async function updateAutoWordSet({
  autoWordSet,
  userPlatformId,
  autoConfig,
  dataVersion,
}: UpdateAutoWordSetProps): Promise<void> {
  const db = await getMongoDB();
  const users = db.collection('users');

  const setFields: Record<string, unknown> = { autoWordSet };
  if (autoConfig) {
    setFields.autoConfig = autoConfig;
  }
  if (dataVersion !== undefined) {
    setFields.dataVersion = dataVersion;
  }

  await users.updateOne({ userPlatformId }, { $set: setFields });
}
