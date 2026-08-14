import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  roots: ['<rootDir>/__tests__'],
  testPathIgnorePatterns: ['<rootDir>/e2e'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  coveragePathIgnorePatterns: [
    '<rootDir>/components/ui',
    '<rootDir>/node_modules',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^uuid$': '<rootDir>/__mocks__/uuid.ts',
  },
}

export default createJestConfig(config)
