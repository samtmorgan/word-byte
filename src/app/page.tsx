'use client';

import axios from 'axios';
// import LinkButton from '@/components/LinkButton';
// import Select from '@/components/Select';
import React, { useEffect, useState } from 'react';
// import { generateWordList } from '../utils/wordUtils';

export default function Home() {
  const [words, setWords] = useState<string[]>();

  const protocol = 'https://';
  const host = 'word-byte-api.onrender.com/';
  const currentWordsPath = 'api/words/currentWords';

  useEffect(() => {
    axios
      .get(`${protocol}${host}${currentWordsPath}`)
      .then(res => {
        const theWords = res.data;
        console.log(theWords);
        setWords(theWords);
      })
      .catch(e => console.log(e));
  }, []);

  return (
    <>
      <h1>Hi, I am Word Byte</h1>
      {words && words.map((word: string) => <span>{word}</span>)}

      {/* display 7 day practice summary starting at beginning of current set
        - maybe format of 5/8 for each day  */}
    </>
  );
}
