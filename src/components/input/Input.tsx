import React from 'react';

export type InputProps = {
  value: string;
  onChange: (value: string) => void;
  name: string;
  placeholder?: string;
  label?: string;
  min?: number;
  max?: number;
  pattern?: string;
};

export default function Input({ value, onChange, name, placeholder, label, min, max, pattern }: InputProps) {
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
        min={min}
        max={max}
        pattern={pattern}
      />
    </div>
  );
}
