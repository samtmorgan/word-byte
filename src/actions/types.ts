export interface Result {
  created: number;
  pass: boolean;
}

export enum WordOwner {
  PLATFORM = 'platform',
  USER = 'user',
}
export interface Word {
  word: string;
  wordId: string;
  owner: WordOwner;
  results: Result[];
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
}

export type AuthUser = {
  userAuthId: string;
  username: string;
};

export interface User extends DbUser {
  username: string;
}

export type NewIdDbUser = Omit<DbUser, '_id'>;
