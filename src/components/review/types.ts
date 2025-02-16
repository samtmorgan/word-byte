import React from 'react';
import { Word } from '../../actions/getUser';

type ReviewProps = {
  currentWords: Word[];
};

type LocalResults = {
  pass: boolean | null;
  wordId: string;
  word: string;
}[];

enum ReviewLifecycle {
  IN_PROGRESS = 'inProgress',
  COMPLETE = 'complete',
}

type ReviewButtonsProps = {
  reviewLifecycle: ReviewLifecycle;
  setReviewLifecycle: React.Dispatch<React.SetStateAction<ReviewLifecycle>>;
};

export { ReviewLifecycle };
export type { ReviewProps, LocalResults, ReviewButtonsProps };
