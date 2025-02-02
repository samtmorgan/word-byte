import React from 'react';
import WelcomeContent from '../../components/pageComponents/WelcomeContent';
import initUser from '../../actions/initUser';

export default async function Welcome() {
  const user = await initUser();

  return <WelcomeContent user={user} />;
}
