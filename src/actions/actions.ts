'use server';

import client from '../lib/mongoClient';

interface Result {
  created: number;
  pass: boolean;
}

export interface Word {
  word: string;
  wordId: string;
  owner: 'platform' | 'user';
  results: Result[];
}

interface WordSet {
  wordSetId: string;
  createdAt: number;
  wordIds: string[];
}

export interface User {
  _id: string;
  userAuthId: string;
  userPlatformId: string;
  userName: string;
  createdAt: 1735938406366;
  wordSets: WordSet[];
  words: Word[];
}

enum Errors {
  GET_USER_ERROR = 'getUserError',
  GET_CURRENT_WORDS_ERROR = 'getCurrentWordsError',
  USER_NOT_FOUND = 'userNotFound',
  WORD_SETS_NOT_FOUND = 'wordSetsNotFound',
}

enum Status {
  OK = 'ok',
  ERROR = 'error',
}

interface Response {
  status: Status;
}

interface ResponseError extends Response {
  message: Errors;
}

interface GetUserResponse extends Response {
  user: User | null;
}

interface getCurrentWordsResponse extends Response {
  currentWords: Word[] | null;
}

export async function getUser(userAuthId: string): Promise<GetUserResponse | ResponseError> {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db('wordByteTest');
    const user = (await db.collection('users').findOne({ userAuthId })) as User | null;
    const res: GetUserResponse = { status: Status.OK, user: JSON.parse(JSON.stringify(user)) };
    return res;
  } catch (e) {
    console.error(e);
    return { status: Status.ERROR, message: Errors.GET_USER_ERROR };
  }
}

export async function getCurrentWords(userAuthId: string): Promise<getCurrentWordsResponse | ResponseError> {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db('wordByteTest');
    const user = (await db.collection('users').findOne({ userAuthId })) as User | null;

    if (!user) {
      return { status: Status.ERROR, message: Errors.USER_NOT_FOUND };
    }

    const currentWords = user?.wordSets[0]?.wordIds
      .map(wordId => user.words.find(word => word.wordId === wordId))
      .filter(word => word !== undefined) as Word[];

    if (!currentWords || currentWords.length === 0) {
      return { status: Status.OK, currentWords: null };
    }

    return { status: Status.OK, currentWords };
  } catch (e) {
    console.error(e);
    return { status: Status.ERROR, message: Errors.GET_CURRENT_WORDS_ERROR };
  }
}
