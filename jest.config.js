module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '/__utils__/'],
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/lib/mongodb.ts',
    '!src/utils/wordUtils.ts',
    '!src/context/*.tsx',
    '!src/components/select/Select.tsx',
    '!src/components/review/Review.tsx',
    '!src/components/input/Input.tsx',
    '!src/components/fireworks/Fireworks.tsx',
    '!src/app/test/page.tsx',
    '!src/app/settingsWords/page.tsx',
    '!src/app/settingsAccount/page.tsx',
    '!src/app/settingsWords/page.tsx',
    '!src/app/settings/page.tsx',
    '!src/app/*.tsx',
    '!src/middleware.ts',
  ],
};
