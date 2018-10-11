module.exports = {
  verbose: true,
  rootDir: 'tests',
  testMatch: ['**/?(*.)+(spec|test).js?(x)'],
  globalSetup: './global.js',
  globalTeardown: './teardown.js',
  testURL: 'http://localhost/',
};
