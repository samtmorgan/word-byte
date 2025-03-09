import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface IFormInput {
  word: string;
}

const INPUT_NAME = 'word';

export function AddWordForm({ handleAddWord }: { handleAddWord: (arg0: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ mode: 'onBlur' });

  const onSubmit: SubmitHandler<IFormInput> = data => {
    handleAddWord(data.word);
  };

  return (
    <form className="add-word-form" onSubmit={handleSubmit(onSubmit)}>
      <span>
        <label htmlFor={INPUT_NAME}>
          Add new word *capitalisation matters
          <input {...register('word', { required: true, pattern: /^[A-Za-z][a-z]*$/ })} id={INPUT_NAME} />
        </label>
        {errors.word?.type === 'required' && <p role="alert">Word needs some letters</p>}
        {errors.word?.type === 'pattern' && <p role="alert">Word must have letters only</p>}
      </span>
      <button type="submit">Add</button>
    </form>
  );
}
