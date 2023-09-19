/** @type {import('jest').Config} */
const config = {
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  transformIgnorePatterns: [],
  coverageDirectory: "artifacts/coverage/jest",
  collectCoverageFrom: ["<rootDir>/src/**/*"],
};

export default config;
