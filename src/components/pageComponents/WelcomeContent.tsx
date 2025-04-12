import React from 'react';
import Link from 'next/link';
import { User } from '../../actions/types';
import { PATHS } from '../../constants';

export default function WelcomeContent({ user }: { user: User | null }) {
  if (!user) {
    return null;
  }

  return (
    <div className="pageContainer">
      <h1>Hello {user.username} 👋</h1>
      <Link href={PATHS.TEST} className="button cool-border-with-shadow">
        ✍️ Practice Now
      </Link>
      <Link href={PATHS.NEW_WORD_LIST} className="button cool-border-with-shadow">
        ⛮ Make new word list
      </Link>
    </div>
  );
}
