import React from 'react';
import { Button } from '../components/Button';

export default function Home() {
  return (
    <div>
      <h1>This is Word Byte</h1>
      <p>A place to practice KS2 spellings!</p>
      <Button label="✍️ Take a test now" href="/test" type="link" />
    </div>
  );
}
