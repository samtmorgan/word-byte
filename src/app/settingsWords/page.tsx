'use client';

import React, { useCallback, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppContext } from '../../context/AppContext';
import Loader from '../../components/Loader';
import { Button } from '../../components/Button';

interface IFormInput {
  word: string;
}

function AddWordForm({ handleAddWord }: { handleAddWord: (arg0: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = data => {
    handleAddWord(data.word);
  };
  return (
    <form className="add-word-form" onSubmit={handleSubmit(onSubmit)}>
      <span className="add-word-input">
        <label className="add-word-input" htmlFor="word">
          Add new word *capitalisation matters
          <input {...register('word', { required: true, pattern: /^[A-Za-z]+$/i })} id="word" />
        </label>
        {errors.word?.type === 'required' && <p role="alert">Word needs some letters</p>}
        {errors.word?.type === 'pattern' && <p role="alert">Word must have letters only</p>}
      </span>
      <Button label="Add" type="submit" />
    </form>
  );
}

export default function SettingsWords() {
  const { user, setUser } = useAppContext();
  const [editMode, setEditMode] = useState(false);

  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors },
  //   } = useForm<IFormInput>();
  //   //   const onSubmit: SubmitHandler<IFormInput> = data => console.log(data);

  //   const onSubmit: SubmitHandler<IFormInput> = data => {
  //     console.log(data);
  //   };

  const handleEditState = useCallback(() => {
    setEditMode(!editMode);
  }, [editMode]);

  //   const handleEmptyCurrent = useCallback(() => {
  //     if (!user) return;
  //     const userUpdate = { ...user };
  //     userUpdate.words.current = [];
  //     setUser(userUpdate);
  //   }, [setUser, user]);

  const handleRemoveWord = useCallback(
    (wordToRemove: string) => {
      if (!user) {
        return;
      }
      if (user.words.wordSets[0].length > 0) {
        const userUpdate = { ...user };
        userUpdate.words.wordSets[0] = user.words.wordSets[0].filter(word => word !== wordToRemove);
        setUser(userUpdate);
      }
    },
    [setUser, user],
  );

  const handleAddWord = useCallback(
    (word: string) => {
      if (!user) {
        return;
      }
      const userUpdate = { ...user };
      userUpdate.words.wordSets[0].push(word);
      setUser(userUpdate);
    },
    [setUser, user],
  );

  if (!user) return <Loader />;

  return (
    <div className="page-container">
      <section>
        <h1>This is your current set of words</h1>
        {user.words.wordSets[0].length > 0 ? (
          <ol className="word-list" type="1">
            {user.words.wordSets[0].map(word => (
              <span key={word} className="word-list-item">
                <li>{word}</li>
                {editMode && (
                  <button
                    aria-label={`Remove word: ${word}`}
                    className="button cool-border-with-shadow icon-button"
                    type="button"
                    onClick={() => handleRemoveWord(word)}
                  >
                    ❌
                  </button>
                )}
              </span>
            ))}
          </ol>
        ) : (
          <p>🙁 No words here yet</p>
        )}
        {/* 
        <Button label="Edit" onClick={handleEditState} />
        <Button label="Edit" onClick={handleEditState} /> */}
        <section className="edit-controls">
          <Button label={editMode ? 'Finish' : 'Edit'} onClick={handleEditState} />
          {editMode && <AddWordForm handleAddWord={handleAddWord} />}
        </section>
        {/* // <ol>
        //   {sessionWords.length > 0 ? (
        //     sessionWords.map(word => (
        //         <WordItem
        //           word={word.word}
        //           wordUuid={word.uuid}
        //           onClick={handleRemoveFromCurrent}
        //           buttonIcon="❌"
        //           showButton={editMode}
        //           key={word.uuid}
        //         />
        //     ))
        //   ) : (
        //     <div className="wordItem">
        //       <p>There are no words in your current set!...</p>
        //     </div>
        //   )}
        // </ol> */}
        {/* <div>
          <Button label={editMode ? 'Stop Edit' : 'Edit current words'} onClick={() => setEditMode(!editMode)} />
        </div> */}
      </section>
      {/* {editMode && (
        <section className="controls">
          <span>
            <Button label="Clear all words" onClick={handleEmptyCurrent} />
          </span>
          <Input label="Search exiting words" name="search-words" placeholder="Search..." />
          <Input label="Add new custom word" name="add-word" placeholder="New word..." />
          <span>
            <Button label="Add" onClick={() => {}} />
          </span>
        </section>
      )} */}

      {/* <section>
        <h2>Year 3 and 4 standard words</h2>
        <ul className="wordList">
          {year3AndYear4StandardWords.map(word => (
            // <li className="wordItem" key={word.word}>
            //   {word.word}
            //   </li>
            <WordItem
              word={word.word}
              wordUuid={word.uuid}
              onClick={() => handleAddToCurrent(word.uuid)}
              buttonIcon="➕"
              key={word.uuid}
            />
          ))}
        </ul>
        <h2>Your custom words</h2>
        <ul className="wordList">
          {user?.words.customWords.map(word => (
            <li className="wordItem" key={word.word}>
              {word.word}
            </li>
          ))}
        </ul>
      </section> */}
    </div>
  );
}
