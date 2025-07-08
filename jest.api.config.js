module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/api'],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverage: true,
  coverageDirectory: 'coverage/api',
  coverageReporters: ['text', 'lcov', 'html'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports/api',
        filename: 'api-test-report.html',
        expand: true
      }
    ]
  ],
  testTimeout: 30000,
  passWithNoTests: true,
  setupFilesAfterEnv: []
};
