#!/usr/bin/env node

const {execSync} = require('child_process');
const {readFileSync} = require('fs');

execSync('npm run build');

const pkg = JSON.parse(readFileSync('package.json'));
const version = pkg.version;

execSync('npm publish');

execSync(`$git tag v${version}`);
execSync('git push --tags');

console.log('Published!');
