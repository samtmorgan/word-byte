import React, { ReactElement } from 'react';
import { SubmitHandler, useForm, ValidateResult } from 'react-hook-form';

interface IFormInput {
  word: string;
}

interface IAddWordForm {
  setWords: (words: string[]) => void;
  words: string[];
}

const INPUT_NAME = 'word';

export function AddWordForm({ setWords, words }: IAddWordForm): ReactElement {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({ mode: 'onBlur' });

  const onSubmit: SubmitHandler<IFormInput> = data => {
    setWords([...words, data.word]);
    reset();
  };

  const validateDuplicate = (value: string): ValidateResult => (words.includes(value) ? 'duplicate' : true);

  return (
    <form className="add-word-form" onSubmit={handleSubmit(onSubmit)}>
      <span>
        <label htmlFor={INPUT_NAME}>
          Add new word
          <input
            {...register('word', { required: true, pattern: /^[A-Za-z][a-z]*$/, validate: validateDuplicate })}
            id={INPUT_NAME}
          />
        </label>
        {errors.word?.type === 'required' && <p role="alert">Word needs some letters</p>}
        {errors.word?.type === 'pattern' && <p role="alert">Letters only, only first letter can be uppercase</p>}
        {errors.word?.type === 'validate' && <p role="alert">Duplicates not allowed</p>}
      </span>
      <button disabled={Boolean(errors.word)} type="submit">
        Add
      </button>
    </form>
  );
}
