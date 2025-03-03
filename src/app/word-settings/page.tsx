import React from 'react';
import { initialiseUser } from '../../actions/initUser';
import { User } from '../../actions/types';
import { WordSettingsContent } from '../../components/pageComponents/WordSettings/WordSettingsContent';

export default async function WordSettings() {
  const user: User | null = await initialiseUser();

  return <WordSettingsContent user={user} />;
}
