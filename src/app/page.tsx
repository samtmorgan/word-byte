import React from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '../components';

export default async function Home() {
  // Get the userId from auth() -- if null, the user is not signed in
  // const { userId } = await auth();

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
      <p>A place to practice KS2 spellings!</p>
      {/* @ts-expect-error Server Component */}
      <SignedIn>
        <Button label="✍️ Practice now" href="/test" type="link" />
      </SignedIn>
      {/* @ts-expect-error Server Component */}
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}
