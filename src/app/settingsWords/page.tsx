'use client';

import React from 'react';
import { useAppContext } from '../../context/AppContext';
// import { year3AndYear4StandardWords } from '../../mockData/words';
import { Button } from '../../components/Button';
import Input from '../../components/Input';
import Loader from '../../components/Loader';

// import LinkButton from '../../components/LinkButton';

// function WordItem({
//   word,
//   wordUuid,
//   onClick,
//   buttonIcon,
//   showButton = false,
// }: {
//   word: string;
//   wordUuid: string;
//   onClick: any;
//   buttonIcon: string;
//   showButton?: boolean;
// }) {
//   return (
//     <li className="wordItem">
//       {word}
//       {showButton && <Button iconButton label={buttonIcon} onClick={() => onClick(wordUuid)} />}
//     </li>
//   );
// }

export default function SettingsWords() {
  const { user, sessionWords } = useAppContext();
  //   const [editMode, setEditMode] = useState(false);

  //   const handleEmptyCurrent = useCallback(() => {
  //     if (!user) return;
  //     const userUpdate = { ...user };
  //     userUpdate.words.current = [];
  //     setUser(userUpdate);
  //   }, [setUser, user]);

  //   const handleRemoveFromCurrent = useCallback(
  //     (uuidToRemove: string) => {
  //       if (!user) {
  //         return;
  //       }
  //       if (user.words.current) {
  //         const userUpdate = { ...user };
  //         userUpdate.words.current = user.words.current.filter(word => word !== uuidToRemove);
  //         setUser(userUpdate);
  //       }
  //     },
  //     [setUser, user],
  //   );

  //   const handleAddToCurrent = useCallback(
  //     (uuidToAdd: string) => {
  //       if (!user) {
  //         return;
  //       }
  //       const userUpdate = { ...user };
  //       const newCurrentWords = [...userUpdate.words.current, uuidToAdd];
  //       userUpdate.words.current = newCurrentWords;
  //       setUser(userUpdate);
  //     },

  //     [setUser, user],
  //   );

  if (!user) return <Loader />;

  return (
    <div className="page-container settings">
      <section>
        <h1>This is your current set of words</h1>
        {user.words.wordSets[0].length > 0 ? (
          <ol className="word-list" type="1">
            {sessionWords.map(word => (
              <li key={word.word}>{word.word}</li>
            ))}
          </ol>
        ) : (
          <p>🙁 No words here yet, add words below..</p>
        )}
        <div>
          <Input label="Add new word" name="add-word" placeholder="New word..." />
          <span>
            <Button label="Add" onClick={() => {}} />
          </span>
        </div>

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
