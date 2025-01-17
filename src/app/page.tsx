import * as React from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
// import { auth } from '@clerk/nextjs/server';
// import { redirect } from 'next/navigation';
import { Button } from '../components';
// import { getUser } from '../actions/actions';

export default async function Home() {
  // Get the userId from auth() -- if null, the user is not signed in
  // const { userId } = await auth();

  // if (userId) {
  //   redirect('/welcome');
  // }
  // getUser('clerk id');

  // if (userId) {
  //   console.log('User is signed in', { userId });
  //   // Query DB for user specific information or display assets only to signed in users
  // }

  // // Get the Backend API User object when you need access to the user's information
  // const user = await currentUser();
  // // Use `user` to render user details or create UI elements
  // console.log(user);

  return (
    <div>
      <h1>This is Word Byte</h1>
      <p>A place to practice Key Stage two spellings!</p>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <SignedIn>
        <h2>Welcome Back!</h2>
        <Button label="✍️ Practice now" href="/test" type="link" />
      </SignedIn>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}{' '}
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}
