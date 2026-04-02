/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const execSync = require('child_process').execSync;
const fs = require('fs');

console.log(`Preparing test page for gh-pages deployment.`);

execSync(`npm run build && npm run predeploy`, {stdio: 'pipe'});

// Copy test/index.html to build/ directory.
// Update the path at which the test_bundle can be found.
let testPage = fs.readFileSync('./test/index.html').toString();
testPage = testPage.replace('../build/test_bundle.js', 'test_bundle.js');
fs.writeFileSync('build/index.html', testPage, 'utf-8');
console.log(
  `Open 'build/index.html' in a browser to see results, or upload the 'build' directory to ghpages.`,
);
