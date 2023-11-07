import React from 'react';

export default function Select() {
  return (
    <label htmlFor="dog-names">
      Choose a dog name:
      <select name="dog-names" id="dog-names">
        <option value="rigatoni">Rigatoni</option>
        <option value="dave">Dave</option>
        <option value="pumpernickel">Pumpernickel</option>
        <option value="reeses">Reeses</option>
      </select>
    </label>
  );
}
