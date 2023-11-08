export type ButtonType = {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

// export type UserType = {
//   name: string;
//   uuid: string;
//   words: UserWordType[];
// } | null;

export type UserType = {
  name: string;
  uuid: string;
  words: {
    current: string[] | null;
    history: object[] | null;
    customWords: UserWordType[];
  };
} | null;

export type TestLifecycleType = 'notStarted' | 'test' | 'review' | 'revise' | 'finished' | 'cancelled';

export type ContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: boolean;
  setError: (error: boolean) => void;
  user: UserType;
  setUser: (user: UserType) => void;
  sessionWords: SessionWordType[] | null;
  setSessionWords: (sessionWords: SessionWordType[] | null) => void;
  testLifecycle: string | null;
  setTestLifecycle: (testLifecycle: TestLifecycleType | null) => void;
};

export type UserWordType = {
  word: string;
  uuid: string;
  //   owner: 'platform' | 'user';
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
