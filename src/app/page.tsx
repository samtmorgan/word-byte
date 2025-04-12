import * as React from 'react';
import { SignedOut, SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
// import { Button } from '../components';
// import { getUser } from '../actions/actions';

export default async function Home() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth();

  if (userId) {
    redirect('/welcome');
  }

  return (
    <div>
      <h1>This is Word Byte</h1>
      <p>A place to practice Key Stage two spellings!</p>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}
