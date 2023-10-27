'use client';

import React from 'react';

export default function Home() {
  const speak = () => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = 'Hello World';
    window.speechSynthesis.speak(msg);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Hi, I am Word Byte</h1>
        <button type="button" onClick={speak}>
          speak
        </button>
      </div>
    </main>
  );
}
