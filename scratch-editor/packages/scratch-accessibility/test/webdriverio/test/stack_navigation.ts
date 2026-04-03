/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as chai from 'chai';
import {
  getCurrentFocusedBlockId,
  getCurrentFocusNodeId,
  tabNavigateToWorkspace,
  testFileLocations,
  testSetup,
  sendKeyAndWait,
  checkForFailures,
  pause,
} from './test_setup.js';

suite('Stack navigation', function () {
  // Clear the workspace and load start blocks.
  setup(async function () {
    this.browser = await testSetup(testFileLocations.COMMENTS, this.timeout());
    await pause(this.browser);
  });

  teardown(async function () {
    await checkForFailures(
      this.browser,
      this.currentTest?.title,
      this.currentTest?.state,
    );
  });

  test('Next', async function () {
    await tabNavigateToWorkspace(this.browser);
    chai.assert.equal(
      'p5_setup_1',
      await getCurrentFocusedBlockId(this.browser),
    );
    await sendKeyAndWait(this.browser, 'n');
    chai.assert.equal(
      'p5_draw_1',
      await getCurrentFocusedBlockId(this.browser),
    );
    await sendKeyAndWait(this.browser, 'n');
    chai.assert.equal(
      'workspace_comment_1',
      await getCurrentFocusNodeId(this.browser),
    );
    await sendKeyAndWait(this.browser, 'n');
    // Looped around.
    chai.assert.equal(
      'p5_setup_1',
      await getCurrentFocusedBlockId(this.browser),
    );
  });

  test('Previous', async function () {
    await tabNavigateToWorkspace(this.browser);
    chai.assert.equal(
      'p5_setup_1',
      await getCurrentFocusedBlockId(this.browser),
    );
    await sendKeyAndWait(this.browser, 'b');
    // Looped to bottom.
    chai.assert.equal(
      'workspace_comment_1',
      await getCurrentFocusNodeId(this.browser),
    );
    await sendKeyAndWait(this.browser, 'b');
    chai.assert.equal(
      'p5_draw_1',
      await getCurrentFocusedBlockId(this.browser),
    );
    await sendKeyAndWait(this.browser, 'b');
    chai.assert.equal(
      'p5_setup_1',
      await getCurrentFocusedBlockId(this.browser),
    );
  });
});
