'use client';

import React from 'react';

export default function NewWordList() {
  // const [newWords, setNewWords] = useState<string[]>(Array.from({ length: 0 }));
  // const [newWord, setNewWord] = useState<string>('');

  return (
    <>
      <h1>New word list</h1>
      {/* <div className="input-container">
        <label htmlFor="new-word">New word</label>
        <div className="add-new-word-container">
          <input
            className="cool-border-with-shadow"
            name="new-word"
            value={newWord}
            onChange={e => setNewWord(e.target.value)}
          />
          <button
            className="button cool-border-with-shadow"
            type="button"
            onClick={() => {
              setNewWords([...newWords, newWord]);
              setNewWord('');
            }}
            disabled={!newWord}
          >
            Add word
          </button>
        </div>
      </div>

      {newWords.length > 0 && (
        <ol>
          {newWords.map((word, index) => (
            <div key={word} className="add-new-word-container">
              <li>{word}</li>
               <button
                type="button"
                onClick={() => {
                  setNewWords(newWords.filter((_, i) => i !== index));
                }}
                className="button cool-border-with-shadow"
              >
                ❌
              </button>
            </div>
          ))}
        </ol>
      )} */}
    </>
  );
}
