/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/__test__/utils/testcontainer/mongo.setup.ts"],
  testTimeout: 60000,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!__test__/**/*",
    "!scripts/**/*",
  ],
  coveragePathIgnorePatterns: [
    "/__test__/measure-test-times.ts",
    "src/index.ts",
    "src/events/",
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
