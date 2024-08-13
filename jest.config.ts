export default {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  rootDir: 'tests',
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  globalSetup: './global.ts',
  globalTeardown: './teardown.js',
};
