import { render } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { AppContext } from '../../src/context/AppContext';
import { ContextType } from '../../src/types/types';

// A custom render to setup providers. Extends regular
// render options with `providerProps` to allow injecting
// different scenarios to test with.
// @see https://testing-library.com/docs/react-testing-library/setup#custom-render
export function renderWithContext(ui: ReactElement, providerProps: ContextType): any {
  return render(<AppContext.Provider value={providerProps}>{ui}</AppContext.Provider>);
}
