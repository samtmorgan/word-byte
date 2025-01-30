import React from 'react';
import initUser from '../../actions/initUser';

export default async function WelcomeContent() {
  const user = await initUser();
  console.log({ user });

  return user ? <div>Hello {user.username} 👋</div> : null;
}
