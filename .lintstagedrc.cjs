module.exports = {
  '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
  '**/*.{ts,tsx}': filenames => {
    const nonTest = filenames.filter(f => !f.endsWith('.test.ts') && !f.endsWith('.test.tsx'));
    if (nonTest.length === 0) return [];
    return [`tsc-files --noEmit index.d.ts ${nonTest.join(' ')}`];
  },
};
