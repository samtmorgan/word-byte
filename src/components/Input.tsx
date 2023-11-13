import React from 'react';
import { InputType } from '../types/types';

export default function Input({ value, onChange, name, placeholder, label }: InputType) {
  return (
    <div className="input-container">
      <label htmlFor={name}>{label} </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        name={name}
        className="cool-border-with-shadow"
        type="text"
        id={name}
      />
    </div>
  );
}
