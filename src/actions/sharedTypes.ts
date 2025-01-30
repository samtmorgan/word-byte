enum Errors {
  GET_USER_ERROR = 'getUserError',
  GET_CURRENT_WORDS_ERROR = 'getCurrentWordsError',
  USER_NOT_FOUND = 'userNotFound',
  WORD_SETS_NOT_FOUND = 'wordSetsNotFound',
  AUTH_USER_NOT_FOUND = 'authUserNotFound',
  GET_USERNAME_ERROR = 'getUsernameError',
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

export { Errors, Status };
export type { Response, ResponseError };
