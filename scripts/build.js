const rollup = require('rollup');
const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').execSync;
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');

// make sure we're in the right folder
process.chdir(path.resolve(__dirname, '..'));

const binFolder = path.resolve('node_modules/.bin/');

fs.removeSync('dist');

const rollupPlugins = [
  resolve(),
  babel({
    exclude: 'node_modules/**', // only transpile our source code
  }),
];

async function generateBundledModule(inputFile, outputFile, format) {
  console.log(`Generating ${outputFile} bundle.`);

  const bundle = await rollup.rollup({
    input: inputFile,
    plugins: rollupPlugins,
  });
  bundle.write({
    file: outputFile,
    format,
    banner: '/** mobase - (c) Evite Inc. 2018 - MIT Licensed */',
    exports: 'named',
  });
}

function build() {
  return Promise.all([
    generateBundledModule(
      path.resolve('src', 'index.js'),
      path.resolve('dist', 'mobase.cjs.js'),
      'cjs'
    ),
    generateBundledModule(
      path.resolve('src', 'index.js'),
      path.resolve('dist', 'mobase.js'),
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
