export interface Result {
  created: number;
  pass: boolean;
}

export enum WordOwner {
  PLATFORM = 'platform',
  USER = 'user',
}

export type YearGroup = 'year3_4' | 'year5_6';

export interface Word {
  word: string;
  wordId: string;
  owner: WordOwner;
  results: Result[];
  yearGroup?: YearGroup;
}

export interface WordSet {
  wordSetId: string;
  createdAt: number;
  wordIds: string[];
}

export interface DbUser {
  _id: string;
  userAuthId: string;
  userPlatformId: string;
  createdAt: number;
  wordSets: WordSet[];
  words: Word[];
  autoWordSet?: WordSet;
}

export type AuthUser = {
  userAuthId: string;
  username: string;
};

export interface User extends DbUser {
  username: string;
}

export type NewIdDbUser = Omit<DbUser, '_id'>;
