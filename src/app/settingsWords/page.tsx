'use client';

import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { year3AndYear4StandardWords } from '../../mockData/words';

// import LinkButton from '../../components/LinkButton';

export default function SettingsWords() {
  const { user, sessionWords } = useAppContext();

  console.log('user', user);
  return (
    <div className="test-page-container">
      <h1>Word settings</h1>
      {/* <div style={{ gap: '1rem' }}>
        <LinkButton href="/settingsAccount" label="Account settings" />
        <LinkButton href="/settingsWords" label="Word settings" />
      </div> */}
      <section>
        <h2>The words you are currently learning</h2>
        <ul className="wordList">
          {sessionWords?.map(word => (
            <li className="wordItem" key={word.word}>
              {word.word}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Year 3 and 4 standard words</h2>
        <ul className="wordList">
          {year3AndYear4StandardWords.map(word => (
            <li className="wordItem" key={word.word}>
              {word.word}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Your custom words</h2>
        <ul className="wordList">
          {user?.words.customWords.map(word => (
            <li className="wordItem" key={word.word}>
              {word.word}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
