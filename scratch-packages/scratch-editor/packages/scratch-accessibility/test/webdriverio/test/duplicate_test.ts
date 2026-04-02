/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import * as chai from 'chai';
import {
  focusOnBlock,
  getCurrentFocusedBlockId,
  getFocusedBlockType,
  PAUSE_TIME,
  tabNavigateToWorkspace,
  testFileLocations,
  testSetup,
  sendKeyAndWait,
  checkForFailures,
  pause,
} from './test_setup.js';

suite('Duplicate test', function () {
  // Disable timeouts when non-zero PAUSE_TIME is used to watch tests run.
  if (PAUSE_TIME) this.timeout(0);

  // Clear the workspace and load start blocks.
  setup(async function () {
    this.browser = await testSetup(testFileLocations.BASE, this.timeout());
    await pause(this.browser);
  });

  teardown(async function () {
    await checkForFailures(
      this.browser,
      this.currentTest?.title,
      this.currentTest?.state,
    );
  });

  test('Duplicate block', async function () {
    // Navigate to draw_circle_1.
    await focusOnBlock(this.browser, 'draw_circle_1');

    // Duplicate
    await sendKeyAndWait(this.browser, 'd');

    // Check a different block of the same type has focus.
    chai.assert.notEqual(
      'draw_circle_1',
      await getCurrentFocusedBlockId(this.browser),
    );
    chai.assert.equal('simple_circle', await getFocusedBlockType(this.browser));
  });

  test('Duplicate workspace comment', async function () {
    await tabNavigateToWorkspace(this.browser);
    const text = 'A comment with text';

    // Create a single comment.
    await this.browser.execute((text: string) => {
      const workspace = Blockly.getMainWorkspace();
      Blockly.serialization.workspaceComments.append(
        {
          text,
          x: 200,
          y: 200,
        },
        workspace,
      );
      Blockly.getFocusManager().focusNode(
        (workspace as Blockly.WorkspaceSvg).getTopComments()[0],
      );
    }, text);
    await pause(this.browser);

    // Duplicate.
    await sendKeyAndWait(this.browser, 'd');

    // Assert we have two comments with the same text.
    const commentTexts = await this.browser.execute(() =>
      Blockly.getMainWorkspace()
        .getTopComments(true)
        .map((comment) => comment.getText()),
    );
    chai.assert.deepEqual(commentTexts, [text, text]);
    // Assert it's the duplicate that is focused (positioned below).
    const [comment1, comment2] = await this.browser.$$('.blocklyComment');
    chai.assert.isTrue(await comment2.isFocused());
    chai.assert.isTrue(
      (await comment2.getLocation()).y > (await comment1.getLocation()).y,
    );
  });
});
