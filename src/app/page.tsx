import * as React from 'react';
import { SignedOut, SignInButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
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
