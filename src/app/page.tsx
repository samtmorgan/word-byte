'use client';

// import { generateWordList } from '@/utils/wordUtils';
// import LinkButton from '@/components/LinkButton';
// import Select from '@/components/Select';
import React from 'react';

export default function Home() {
  //   const speak = () => {
  //     const msg = new SpeechSynthesisUtterance();
  //     // msg.text = 'Hello World';
  //     msg.text = 'Well done Pala';

  //     window.speechSynthesis.speak(msg);
  //   };

  //   console.log(
  //     generateWordList(
  //       [
  //         'cheekily',
  //         'angrily',
  //         'heavily',
  //         'heroically',
  //         'magically',
  //         'automatically',
  //         'bossily',
  //         'comically',
  //         'physically',
  //         'finally',
  //       ],
  //       'user',
  //     ),
  //   );

  return (
    <>
      <h1>Hi, I am Word Byte</h1>
      {/* <Button label="speak" onClick={speak} /> */}
      {/* <span className="button cool-border-with-shadow">
        <Link type="button" href="/test">
          test
        </Link>
      </span> */}
      {/* <LinkButton label="test" href="/test" /> */}
      {/* <Select /> */}
    </>
  );
}
