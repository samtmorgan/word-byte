'use server';

import client from '../lib/mongoClient';
import { Errors, Response, ResponseError, Status } from './sharedTypes';

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

interface getCurrentWordsResponse extends Response {
  currentWords: Word[] | null;
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
