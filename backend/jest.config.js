module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  setupFiles: [],
  moduleNameMapper: {
    '^@uploads/(.*)$': '<rootDir>/src/uploads/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@bullBoard/(.*)$': '<rootDir>/src/bullBoard/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@service/(.*)$': '<rootDir>/src/service/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
};
