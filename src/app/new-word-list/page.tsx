'use client';

import React, { useState } from 'react';
import { AddWordForm } from '../../components';
import { WordList } from '../../components/wordList/WordList';

export default function NewWordList(): React.ReactElement {
  const [newWords, setWords] = useState<string[]>([]);

  return (
    <>
      <h1>New word list</h1>
      <AddWordForm words={newWords} setWords={setWords} />
      <WordList words={newWords} setWords={setWords} />
      <button disabled={newWords.length < 1} type="button">
        Done
      </button>
    </>
  );
}
