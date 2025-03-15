'use client';

import React, { useState } from 'react';
import { AddWordForm } from '../../components';
import { WordList } from '../../components/wordList/WordList';
import styles from './page.module.css';

export default function NewWordList(): React.ReactElement {
  const [newWords, setWords] = useState<string[]>([]);

  return (
    <div className="pageContainer">
      <div className={styles.newWordListContainer}>
        <h1>New word list</h1>
        <AddWordForm words={newWords} setWords={setWords} />
        <WordList words={newWords} setWords={setWords} />
        <div className={styles.buttonContainer}>
          <button disabled={newWords.length < 1} type="button">
            Add word list
          </button>
        </div>
      </div>
    </div>
  );
}
