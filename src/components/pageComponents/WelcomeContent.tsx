import React from 'react';
import Button from '../button/Button';
import { User } from '../../actions/initUser';

export default function WelcomeContent({ user }: { user: User | null }) {
  console.log({ user });

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Hello {user.username} 👋</h1>
      <Button label="✍️ Practice now" href="/test" type="link" />
    </div>
  );
}
