module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '/__utils__/'],
  testEnvironment: 'jsdom',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
    '!src/testUtils/**',
    '!src/mockData/**',
    '!src/types/**',
    '!src/lib/mongoClient.ts',
    '!src/middleware.ts',
  ],
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
  },
};
