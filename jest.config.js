module.exports = {
  // Setup
  // ---------------
  preset: 'ts-jest',
  setupTestFrameworkScriptFile: '<rootDir>/src/jest.setup.ts',

  // Paths
  // ---------------
  roots: ['<rootDir>/src/'],
  testMatch: ['**/*.test.ts'],

  // Coverage
  // ---------------
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/*.d.ts/',
    'index.ts',
    'types.ts',
    'jest.setup.ts',
  ],

  globals: {
    // ts-jest configuration
    // ---------------
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
};
