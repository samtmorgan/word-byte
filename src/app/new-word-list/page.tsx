'use client';

import React, { useState } from 'react';
import ReactModal from 'react-modal';
import Link from 'next/link';
import { AddWordForm } from '../../components';
import { WordList } from '../../components/wordList/WordList';
import styles from './page.module.css';
import { addWordList } from '../../actions/addWordList';
import { PATHS } from '../../constants';
import { Modal } from '../../components/modal/Modal';

export default function NewWordList(): React.ReactElement {
  const [words, setWords] = useState<string[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  ReactModal.setAppElement('.pageContainer');

  const handleAddWordList = async () => {
    setLoading(true);
    setError(false);
    setSuccess(false);
    setModalOpen(true);
    try {
      addWordList(words);
      setWords([]);
      setLoading(false);
      setSuccess(true);
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="pageContainer">
      <div className={styles.newWordListContainer}>
        <h1>New word list</h1>
        <AddWordForm words={words} setWords={setWords} />
        <WordList words={words} setWords={setWords} />
        <div className={styles.buttonContainer}>
          <button disabled={words.length < 1} onClick={handleAddWordList} type="button">
            Add word list
          </button>
        </div>
      </div>
      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        actions={
          <>
            {!loading && error && (
              <button disabled={words.length < 1} onClick={handleAddWordList} type="button">
                Add word list
              </button>
            )}
            {!loading && success && <Link href={PATHS.ROOT}>Home</Link>}
          </>
        }
      >
        {loading && <h2>Saving...</h2>}
        {!loading && error && (
          <>
            <h2>Sorry, something went wrong!</h2>
            <p>Please try again</p>
          </>
        )}
        {!loading && success && <h2>Word list saved!</h2>}
      </Modal>
    </div>
  );
}
