/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  testPathIgnorePatterns: ["<rootDir>/src/data/"],
  setupFilesAfterEnv: ["<rootDir>/__test__/utils/testcontainer/mongo.setup.ts"],
  testTimeout: 60000,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!__test__/**/*",
    "!scripts/**/*",
    "!src/data/**/*",
  ],
  coveragePathIgnorePatterns: [
    "/__test__/measure-test-times.ts",
    "src/index.ts",
    "src/events/",
    "src/data/",
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 75,
      functions: 85,
      lines: 85,
    },
  },
};
