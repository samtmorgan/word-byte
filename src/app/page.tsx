import React from 'react';
import { Button } from '../components';

export default function Home() {
  return (
    <div>
      <h1>This is Word Byte</h1>
      <p>A place to practice KS2 spellings!</p>
      <Button label="✍️ Practice now" href="/test" type="link" />
    </div>
  );
}
