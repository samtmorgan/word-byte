'use client';

import { Button } from '@/components/Button';
import React from 'react';

export default function Home() {
  const speak = () => {
    const msg = new SpeechSynthesisUtterance();
    // msg.text = 'Hello World';
    msg.text = 'Well done Pala';

    window.speechSynthesis.speak(msg);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Hi, I am Word Byte</h1>
        <Button label="speak" onClick={speak} />
      </div>
    </main>
  );
}
