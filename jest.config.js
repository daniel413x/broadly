const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // as defined in tsconfig.json
    "^@/(.*)$": "<rootDir>/$1",
    // CSS modules
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "json", "text"],
  coveragePathIgnorePatterns: ["/components/ui/common/shadcn/"],
};

module.exports = createJestConfig(customJestConfig);
