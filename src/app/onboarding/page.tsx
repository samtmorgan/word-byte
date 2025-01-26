import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  username: yup.string().min(3).max(15).required(),
});

// currently not used
const Page = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <h1>Welcome New Person!</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="username"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div className="input-container">
              <label htmlFor="username">Enter your username</label>
              <input
                className="cool-border-with-shadow"
                {...field}
                id="username"
                placeholder="username"
                minLength={3}
                maxLength={15}
                name="username"
              />
              {errors.username && <span>{errors.username.message}</span>}
            </div>
          )}
        />
        <button className="button cool-border-with-shadow" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
