import React, { ReactElement } from 'react';

interface WordListProps {
  setWords?: (words: string[]) => void;
  words: string[];
}

export const WordList = ({ words, setWords }: WordListProps): ReactElement => (
  <ol>
    {words.map((word, index) => (
      <div key={word} className="add-new-word-container">
        <li>{word}</li>
        {setWords && (
          <button
            type="button"
            onClick={() => {
              setWords(words.filter((_, i) => i !== index));
            }}
            className="button cool-border-with-shadow"
          >
            ❌
          </button>
        )}
      </div>
    ))}
  </ol>
);
