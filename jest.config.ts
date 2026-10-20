import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/__tests__/**'],
  coverageDirectory: 'coverage',
  setupFiles: ['<rootDir>/jest.setup.js'],
};

export default config;
