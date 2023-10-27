"use client";
import Image from "next/image";
import { y3_y4 } from "../../data/words";

export default function Words() {
  const speak = () => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = "Hello World";
    window.speechSynthesis.speak(msg);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div class="grid grid-cols-8 gap-4">
          {y3_y4.map((word) => (
            <div key={word}>
              <div class="rounded bg-orange-500 p-1.5 text-white">
                <p>{word}</p>
              </div>
              {/* <h1>{word}</h1> */}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
