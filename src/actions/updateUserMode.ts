'use server';

import { getMongoDB } from '../lib/mongoDB';
import { AutoConfig, UserMode } from './types';

type UpdateUserModeProps = {
  userPlatformId: string;
  mode: UserMode;
  autoConfig?: AutoConfig;
};

export async function updateUserMode({ userPlatformId, mode, autoConfig }: UpdateUserModeProps): Promise<void> {
  const db = await getMongoDB();
  const users = db.collection('users');

  const update: Record<string, unknown> = { mode };
  if (autoConfig !== undefined) {
    update.autoConfig = autoConfig;
  }

  await users.updateOne({ userPlatformId }, { $set: update });
}
