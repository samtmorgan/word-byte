import React from 'react';
import Link from 'next/link';
import { User } from '../../actions/types';

export default function WelcomeContent({ user }: { user: User | null }) {
  if (!user) {
    return null;
  }

  return (
    <div className="page-container">
      <h1>Hello {user.username} 👋</h1>
      <Link href="/test" className="button cool-border-with-shadow">
        ✍️ Practice Now
      </Link>
      <Link href="/word-settings" className="button cool-border-with-shadow">
        ⛮ Word Settings
      </Link>
    </div>
  );
}
