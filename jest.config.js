module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '/__utils__/', '<rootDir>/.claude/'],
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
    '!src/types/**',
    '!src/lib/**',
    '!src/mockData/**',
    '!src/testUtils/**',
    '!src/middleware.ts',
    '!src/app/layout.tsx',
    '!src/constants/index.ts',
    '!src/constants/paths.ts',
    '!src/components/review/types.ts',
  ],
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
  },
};
