"use client";
import Image from "next/image";

export default function Home() {
  const speak = () => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = "Hello World";
    window.speechSynthesis.speak(msg);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
        {/* <button onClick={speak}>Speak</button> */}
        <h1>Hi, I am Word Byte</h1>
      </div>
    </main>
  );
}
