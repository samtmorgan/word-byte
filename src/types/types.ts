export type UserType = {
  name: string;
  uuid: string;
  words: {
    wordSets: string[][];
    attempts: object[];
    customWords: UserWordType[];
  };
} | null;

export type MockUserType = {
  name: string;
  uuid: string;
  words: {
    wordSets: string[][];
    attempts: object[];
    customWords: UserWordType[];
  };
};

export type TestLifecycleType = 'notStarted' | 'test' | 'review' | 'revise' | 'finished';

export type ContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: boolean;
  setError: (error: boolean) => void;
  user: UserType;
  setUser: (user: UserType) => void;
  testWords: string[];
};

export type UserWordType = {
  word: string;
  uuid: string;
  owner: string;
};

export interface SessionWordType extends UserWordType {
  correct: boolean;
}

export type ResultType = {
  word: string;
  correct: boolean;
};
