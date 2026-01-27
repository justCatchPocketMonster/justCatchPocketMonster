/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/__test__/utils/testcontainer/mongo.setup.ts"],
  testTimeout: 60000,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts", "!__test__/**/*", "!scripts/**/*"],
  coveragePathIgnorePatterns: ["/__test__/measure-test-times.ts"],
};
