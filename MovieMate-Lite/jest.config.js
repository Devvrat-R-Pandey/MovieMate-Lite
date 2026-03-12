export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["babel-jest", {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        ["@babel/preset-typescript"],
      ],
    }],
  },
  moduleNameMapper: {
    "\\.(css|svg|png|jpg)$": "<rootDir>/src/__tests__/__mocks__/fileMock.js",
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
};