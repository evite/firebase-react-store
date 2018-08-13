#!/usr/bin/env node

const rollup = require('rollup');
const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').execSync;
const babel = require('rollup-plugin-babel');
const autoExternal = require('rollup-plugin-auto-external');

// make sure we're in the right folder
process.chdir(path.resolve(__dirname, '..'));

const binFolder = path.resolve('node_modules/.bin/');

fs.removeSync('dist');

const rollupPlugins = [
  autoExternal(),
  babel({
    exclude: 'node_modules/**', // only transpile our source code
  }),
];

async function generateBundledModule(inputFile, outputFile, format) {
  console.log(`Generating ${outputFile} bundle.`);

  const bundle = await rollup.rollup({
    external: ['@firebase/app', '@firebase/database'],
    input: inputFile,
    plugins: rollupPlugins,
  });
  bundle.write({
    file: outputFile,
    format,
    banner: '/** firebase-react-store - (c) Evite Inc. 2018 - MIT Licensed */',
    exports: 'named',
  });
}

function build() {
  return Promise.all([
    generateBundledModule(
      path.resolve('src', 'index.js'),
      path.resolve('dist', 'firebase-react-store.cjs.js'),
      'cjs'
    ),
    generateBundledModule(
      path.resolve('src', 'index.js'),
      path.resolve('dist', 'firebase-react-store.js'),
      'es'
    ),
  ]).then(() => {
    // generateUmd();
    // generateMinified();
  });
}

build().catch((e) => {
  console.error(e);
  if (e.frame) {
    console.error(e.frame);
  }
  process.exit(1);
});
