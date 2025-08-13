/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/__test__/utils/testcontainer/mongo.setup.ts'],
    testTimeout: 60000,
};