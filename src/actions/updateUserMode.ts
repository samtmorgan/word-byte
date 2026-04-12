'use server';

import { getMongoDB } from '../lib/mongoDB';
import { AutoConfig, UserMode } from './types';
import { ActionResult, ok, safeAction } from './actionResult';
import { updateUserModeSchema } from './schemas';

type UpdateUserModeProps = {
  userPlatformId: string;
  mode: UserMode;
  autoConfig?: AutoConfig;
};

export async function updateUserMode({ userPlatformId, mode, autoConfig }: UpdateUserModeProps): Promise<ActionResult> {
  return safeAction(updateUserModeSchema, { userPlatformId, mode, autoConfig }, async validInput => {
    const db = await getMongoDB();
    const users = db.collection('users');

    const update: Record<string, unknown> = { mode: validInput.mode };
    if (validInput.autoConfig !== undefined) {
      update.autoConfig = validInput.autoConfig;
    }

    await users.updateOne({ userPlatformId: validInput.userPlatformId }, { $set: update });
    return ok();
  });
}
