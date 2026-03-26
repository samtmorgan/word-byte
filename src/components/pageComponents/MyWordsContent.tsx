'use client';

import React, { useState, useTransition } from 'react';
import { Word, WordOwner } from '../../actions/types';
import { addUserWord } from '../../actions/addUserWord';
import { deleteUserWord } from '../../actions/deleteUserWord';
import { checkSpelling } from '../../utils/spellCheck';
import { Modal } from '../modal/Modal';
import styles from './MyWordsContent.module.css';

interface MyWordsContentProps {
  initialWords: Word[];
}

export default function MyWordsContent({ initialWords }: MyWordsContentProps) {
  const [words, setWords] = useState<Word[]>(initialWords);
  const [newWord, setNewWord] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [wordToDelete, setWordToDelete] = useState<Word | null>(null);
  const [, startTransition] = useTransition();

  const getSuccessRate = (word: Word) => {
    const total = word.results.length;
    const passes = word.results.filter(r => r.pass).length;
    return `${passes}/${total}`;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmed = newWord.trim();
    if (!trimmed) {
      setFormError('Word needs some letters');
      return;
    }

    if (!/^[A-Za-z][a-z]*$/.test(trimmed)) {
      setFormError('Letters only, only first letter can be uppercase, no spaces');
      return;
    }

    const isDuplicate = words.some(w => w.word.toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
      setFormError('You already have this word');
      return;
    }

    const spellResult = await checkSpelling(trimmed);
    if (!spellResult.valid) {
      setFormError('Word not found in dictionary');
      return;
    }

    startTransition(async () => {
      const result = await addUserWord(trimmed);
      if (result.success) {
        // Optimistically add word to list
        setWords(prev => [...prev, { word: trimmed, wordId: crypto.randomUUID(), owner: WordOwner.USER, results: [] }]);
        setNewWord('');
      } else if (result.error === 'duplicate') {
        setFormError('You already have this word');
      } else {
        setFormError('Failed to add word, please try again');
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!wordToDelete) return;
    const id = wordToDelete.wordId;
    setWordToDelete(null);
    startTransition(async () => {
      await deleteUserWord(id);
      setWords(prev => prev.filter(w => w.wordId !== id));
    });
  };

  return (
    <div className="pageContainer">
      <h1>My Words</h1>

      <form className={styles.addForm} onSubmit={handleAdd}>
        <label htmlFor="new-word">
          Add new word
          <input
            id="new-word"
            type="text"
            value={newWord}
            onChange={e => setNewWord(e.target.value)}
            autoCapitalize="off"
            autoComplete="off"
          />
        </label>
        {formError && (
          <p className={styles.error} role="alert">
            {formError}
          </p>
        )}
        <button type="submit">Add</button>
      </form>

      {words.length === 0 ? (
        <p>No custom words yet. Add some above!</p>
      ) : (
        <ul className={styles.wordList}>
          {words.map(word => (
            <li key={word.wordId} className={styles.wordItem}>
              <span className={styles.wordText}>{word.word}</span>
              <span className={styles.successRate}>{getSuccessRate(word)}</span>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => setWordToDelete(word)}
                aria-label={`Delete ${word.word}`}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={Boolean(wordToDelete)}
        setOpen={(open: boolean) => {
          if (!open) setWordToDelete(null);
        }}
        actions={
          <>
            <button type="button" onClick={handleDeleteConfirm}>
              Confirm
            </button>
            <button type="button" onClick={() => setWordToDelete(null)}>
              Cancel
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete &apos;{wordToDelete?.word}&apos;?</p>
      </Modal>
    </div>
  );
}
