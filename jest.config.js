module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '/__utils__/'],
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 65,
      lines: 90,
      statements: 70,
    },
  },
};
