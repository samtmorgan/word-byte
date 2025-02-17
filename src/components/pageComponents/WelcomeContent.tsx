import React from 'react';
import Button from '../button/Button';
import { User } from '../../actions/types';

export default function WelcomeContent({ user }: { user: User | null }) {
  if (!user) {
    return null;
  }

  return (
    <div className="page-container">
      <h1>Hello {user.username} 👋</h1>
      <Button label="✍️ Practice now" href="/test" type="link" />
    </div>
  );
}
