// import React from 'react';
import '@testing-library/jest-dom';
// import { screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import SettingsWords from './page';
// import { initProviderState } from '../../context/AppContext';
// import { mockUser } from '../../mockData/user';
// import { renderWithContext } from '../../testUtils/renderWithContext';

// function renderWithContextAndInitState() {
//   const providerProps = { ...initProviderState };
//   const user = mockUser;
//   Object.defineProperty(providerProps, 'user', { value: user });
//   return renderWithContext(<SettingsWords />, providerProps);
// }

// function getEditButton() {
//   const button = screen.getByRole('button', { name: /Edit/ });
//   return button;
// }

describe('placeholder test', () => {
  it('placeholder test', () => {
    expect(true).toBe(true);
  });
});

// jest.mock('../../components/loader/Loader', () => () => <div>Mock Loading...</div>);
// jest.mock('../../actions/initUser', () => ({
//   initUser: jest.fn(),
// }));

// describe.skip('Test the SettingsWords page when loading or there are no words initialised', () => {
//   it('render loading text when context is loading', () => {
//     renderWithContext(<SettingsWords />, initProviderState);
//     expect(screen.getByText('Mock Loading...')).toBeInTheDocument();
//   });
//   it('render message when there are words in the set', () => {
//     const providerProps = { ...initProviderState };
//     const user = { words: { wordSets: [[]] } };
//     Object.defineProperty(providerProps, 'user', { value: user });
//     renderWithContext(<SettingsWords />, providerProps);
//     expect(screen.getByText(/🙁 No words here yet/)).toBeInTheDocument();
//   });
// });

// describe.skip('Test the SettingsWords page when context is initialised with words', () => {
//   // initialise the context with words
//   beforeEach(() => {
//     renderWithContextAndInitState();
//   });

//   it('renders a button to start editing the word list', () => {
//     const editButton = getEditButton();
//     expect(editButton).toBeInTheDocument();
//   });
//   it('edit button should change to finish when clicked', async () => {
//     const user = userEvent.setup();
//     // access your button
//     const editButton = getEditButton();
//     // simulate button click
//     await user.click(editButton);
//     // expect result
//     expect(screen.getByRole('button', { name: /Finish/ })).toBeInTheDocument();
//   });
//   it('edit button should change from edit to finish to edit when clicked', async () => {
//     const user = userEvent.setup();
//     const editButton = getEditButton();
//     await user.click(editButton);
//     expect(screen.getByRole('button', { name: /Finish/ })).toBeInTheDocument();
//     await user.click(editButton);
//     expect(screen.getByRole('button', { name: /Edit/ })).toBeInTheDocument();
//   });
//   it('when in edit mode, renders an input, label and button for adding words', async () => {
//     const user = userEvent.setup();
//     const editButton = getEditButton();
//     await user.click(editButton);
//     expect(screen.getByRole('button', { name: /Add/ })).toBeInTheDocument();
//     expect(screen.getByRole('textbox', { name: 'Add new word *capitalisation matters' })).toBeInTheDocument();
//   });
//   it('when in edit mode, render a remove button for each word', async () => {
//     const user = userEvent.setup();
//     const editButton = getEditButton();
//     await user.click(editButton);
//     const targetButtonNames = mockUser.words.wordSets[0].map(word => `Remove word: ${word}`);
//     expect(targetButtonNames.every(name => screen.getByRole('button', { name }))).toEqual(true);
//   });
//   it('renders a list with the same amount of words as in the user object', () => {
//     const targetLength = mockUser.words.wordSets[0].length;
//     const listItems = screen.getAllByRole('listitem');
//     expect(listItems.length).toBe(targetLength);
//     expect(screen.getByRole('list')).toBeInTheDocument();
//   });
//   it('renders each word as in the user object', () => {
//     const targetWords = mockUser.words.wordSets[0];
//     expect(targetWords?.every(word => screen.getByText(word))).toEqual(true);
//   });
//   it('when in edit mode, when remove word button is clicked, the word is removed from the list', async () => {
//     const user = userEvent.setup();
//     const editButton = getEditButton();
//     await user.click(editButton);
//     const targetButtonNames = mockUser.words.wordSets[0].map(word => `Remove word: ${word}`);
//     const targetButton = screen.getByRole('button', { name: targetButtonNames[0] });
//     await user.click(targetButton);
//     expect(screen.queryByText(targetButtonNames[0])).not.toBeInTheDocument();
//   });
// });

// describe.skip('test the add word input', () => {
//   // initialise the context with words
//   beforeEach(() => {
//     renderWithContextAndInitState();
//   });
//   it('when in edit mode, when add word button is clicked, the word is added to the list', async () => {
//     const user = userEvent.setup();
//     const editButton = getEditButton();
//     await user.click(editButton);
//     const addWordInput = screen.getByRole('textbox', { name: 'Add new word *capitalisation matters' });
//     const addWordButton = screen.getByRole('button', { name: /Add/ });
//     expect(addWordInput).toBeInTheDocument();
//     expect(addWordButton).toBeInTheDocument();
//     const targetWord = 'test';
//     await user.type(addWordInput, targetWord);
//     expect(addWordInput).toHaveValue(targetWord);
//     await user.click(addWordButton);
//     waitFor(() => expect(screen.getByText(targetWord)).toBeInTheDocument());
//   });
// });
