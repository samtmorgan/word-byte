import React from 'react';
import WelcomeContent from '../../components/pageComponents/WelcomeContent';
import { initialiseUser } from '../../actions/initUser';

export default async function Welcome() {
  const user = await initialiseUser();

  return <WelcomeContent user={user} />;
}
