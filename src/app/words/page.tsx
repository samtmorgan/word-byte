'use client';

import React from 'react';
import { y3Y4 } from '../../data/words';

export default function Words() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div className="grid grid-cols-8 gap-4">
          {y3Y4.map(word => (
            <div key={word}>
              <div className="rounded bg-orange-500 p-1.5 text-white">
                <p>{word}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
