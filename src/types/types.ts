// export type UserType = {
//   name: string;
//   uuid: string;
//   words: UserWordType[];
// } | null;

// export type UserType = {
//   name: string;
//   uuid: string;
//   words: {
//     current: string[] | null;
//     history: object[] | null;
//     customWords: UserWordType[];
//   };
// } | null;

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

export type TestLifecycleType = 'notStarted' | 'test' | 'review' | 'revise' | 'finished' | 'cancelled';

export type ContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: boolean;
  setError: (error: boolean) => void;
  user: UserType;
  setUser: (user: UserType) => void;
  testWords: string[];
  //   sessionWords: SessionWordType[] | null;
  //   setSessionWords: (sessionWords: SessionWordType[] | null) => void;
  //   sessionWords: string[] | null;
  //   setSessionWords: (sessionWords: string[] | null) => void;
  //   testLifecycle: string | null;
  //   setTestLifecycle: (testLifecycle: TestLifecycleType | null) => void;
};

export type UserWordType = {
  word: string;
  uuid: string;
  //   owner: 'platform' | 'user';
  owner: string;

  //   current: boolean;
  //   attempts:
  //     | {
  //         timestamp: number;
  //         pass: boolean;
  //       }[]
  //     | null;
};

export interface SessionWordType extends UserWordType {
  correct: boolean;
}

export type InputType = {
  value: string;
  onChange: (value: string) => void;
  name: string;
  placeholder?: string;
  label?: string;
};

export type ResultType = {
  word: string;
  correct: boolean;
};
