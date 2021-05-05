module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!**/protocols/**',
    '!**/test/**',
    '!<rootDir>/src/infra/db/mongodb/helper/migrations/**',
    '!<rootDir>/src/main/docs'
  ],
  coverageDirectory: 'coverage',
  roots: [
    '<rootDir>/src'
  ],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
