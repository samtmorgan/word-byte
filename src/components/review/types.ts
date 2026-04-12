import React from 'react';
import { Word } from '../../actions/types';

export type { LocalResults } from '../../actions/types';

type ReviewProps = {
  currentWords: Word[];
  isAutoMode?: boolean;
};

enum ReviewLifecycle {
  IN_PROGRESS = 'inProgress',
  COMPLETE = 'complete',
}

type ReviewButtonsProps = {
  reviewLifecycle: ReviewLifecycle;
  setReviewLifecycle: React.Dispatch<React.SetStateAction<ReviewLifecycle>>;
};

export { ReviewLifecycle };
export type { ReviewProps, ReviewButtonsProps };
