import React, { ReactElement } from 'react';
import styles from './WordList.module.css';

interface WordListProps {
  setWords?: (words: string[]) => void;
  words: string[];
}

export const WordList = ({ words, setWords }: WordListProps): ReactElement | null => (
  <ol className={styles.wordList}>
    {words.map((word, index) => (
      <div key={word} className={styles.newWordContainer}>
        <li className={styles.newWord}>{word}</li>
        {setWords && (
          <button
            type="button"
            onClick={() => {
              setWords(words.filter((_, i) => i !== index));
            }}
            className={styles.removeButton}
          >
            🗑️
          </button>
        )}
      </div>
    ))}
  </ol>
);
