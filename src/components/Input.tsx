import React from 'react';

export default function Input({ name, placeholder, label }: { name: string; placeholder?: string; label?: string }) {
  return (
    <div className="input-container">
      <label htmlFor={name}>{label} </label>
      <input placeholder={placeholder} name={name} className="cool-border-with-shadow" type="text" id={name} />
    </div>
  );
}
