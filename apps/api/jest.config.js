module.exports = {
  displayName: "api",
  preset: "../../jest.preset.js",
  globals: {},
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
      },
    ],
  },
  coverageReporters: ["text", "cobertura"],
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../target/coverage",
  reporters: ["default", "jest-junit"],
  testResultsProcessor: "jest-junit",
};
