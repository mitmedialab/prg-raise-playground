/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as chai from 'chai';
import * as Blockly from 'blockly';
import {Key} from 'webdriverio';
import {
  getFocusedBlockType,
  moveToToolboxCategory,
  PAUSE_TIME,
  focusOnBlock,
  tabNavigateToWorkspace,
  testFileLocations,
  testSetup,
  sendKeyAndWait,
  keyRight,
  keyDown,
  getCurrentFocusedBlockId,
  blockIsPresent,
  keyUp,
  tabNavigateToToolbox,
  checkForFailures,
  pause,
} from './test_setup.js';

suite('Insert test', function () {
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

  test('Insert and cancel with block selection', async function () {
    // Navigate to draw_circle_1.
    await focusOnBlock(this.browser, 'draw_circle_1');
    // Insert 'if' block
    await sendKeyAndWait(this.browser, 't');
    await keyRight(this.browser);
    await sendKeyAndWait(this.browser, Key.Enter);
    chai.assert.equal('controls_if', await getFocusedBlockType(this.browser));
    const ifId = await getCurrentFocusedBlockId(this.browser);
    chai.assert.ok(ifId);

    // Cancel
    await sendKeyAndWait(this.browser, Key.Escape);

    chai.assert.isFalse(await blockIsPresent(this.browser, ifId));
  });

  test('Insert and cancel with workspace selection', async function () {
    // Navigate to workspace.
    await tabNavigateToWorkspace(this.browser);
    await sendKeyAndWait(this.browser, 'w');
    // Insert 'if' block
    await sendKeyAndWait(this.browser, 't');
    await keyRight(this.browser);
    await sendKeyAndWait(this.browser, Key.Enter);
    chai.assert.equal('controls_if', await getFocusedBlockType(this.browser));
    const ifId = await getCurrentFocusedBlockId(this.browser);
    chai.assert.ok(ifId);

    // Cancel
    await sendKeyAndWait(this.browser, Key.Escape);

    chai.assert.isFalse(await blockIsPresent(this.browser, ifId));
  });

  test('Insert C-shaped block with statement block selected', async function () {
    // Navigate to draw_circle_1.
    await focusOnBlock(this.browser, 'draw_circle_1');

    await moveToToolboxCategory(this.browser, 'Functions');
    // Move to flyout.
    await keyRight(this.browser);
    // Select Function block.
    await sendKeyAndWait(this.browser, Key.Enter);
    // Confirm move.
    await sendKeyAndWait(this.browser, Key.Enter);

    chai.assert.equal(
      'procedures_defnoreturn',
      await getFocusedBlockType(this.browser),
    );
  });

  test('Insert without having focused the workspace', async function () {
    await tabNavigateToToolbox(this.browser);

    // Insert 'if' block
    await keyRight(this.browser);
    // Choose.
    await sendKeyAndWait(this.browser, Key.Enter);
    // Confirm position.
    await sendKeyAndWait(this.browser, Key.Enter);

    // Assert inserted inside first block p5_setup not at top-level.
    chai.assert.equal('controls_if', await getFocusedBlockType(this.browser));
    await keyUp(this.browser);
    chai.assert.equal(
      'p5_background_color',
      await getFocusedBlockType(this.browser),
    );
  });

  test('Does not insert between immovable blocks', async function () {
    // Focus the create canvas block; we want to ensure that the newly
    // inserted block is not attached to its next connection, because doing
    // so would splice it into an immovable stack.
    await focusOnBlock(this.browser, 'create_canvas_1');
    await this.browser.execute(() => {
      Blockly.getMainWorkspace()
        .getAllBlocks()
        .forEach((b) => b.setMovable(false));
    });
    await tabNavigateToToolbox(this.browser);

    // Insert 'if' block
    await keyRight(this.browser);
    // Choose.
    await sendKeyAndWait(this.browser, Key.Enter);
    // Confirm position.
    await sendKeyAndWait(this.browser, Key.Enter);

    // Assert inserted inside first block p5_setup not at top-level.
    chai.assert.equal('controls_if', await getFocusedBlockType(this.browser));
    await keyUp(this.browser);
    chai.assert.equal(
      'p5_background_color',
      await getFocusedBlockType(this.browser),
    );
  });
});

suite('Insert test with more blocks', function () {
  // Disable timeouts when non-zero PAUSE_TIME is used to watch tests run.
  if (PAUSE_TIME) this.timeout(0);

  // Clear the workspace and load start blocks.
  setup(async function () {
    this.browser = await testSetup(
      testFileLocations.MORE_BLOCKS,
      this.timeout(),
    );
    await pause(this.browser);
  });

  teardown(async function () {
    await checkForFailures(
      this.browser,
      this.currentTest?.title,
      this.currentTest?.state,
    );
  });

  test('Does not bump immovable input blocks on insert', async function () {
    // Focus the print block with a connected input block. Ordinarily, inserting
    // an input block would connect it to this block and bump its child, but
    // if all blocks are immovable the connected input block should not move
    // and the newly inserted block should be added as a top-level block on the
    // workspace.
    await focusOnBlock(this.browser, 'text_print_2');
    await this.browser.execute(() => {
      Blockly.getMainWorkspace()
        .getAllBlocks()
        .forEach((b) => b.setMovable(false));
    });
    await tabNavigateToToolbox(this.browser);

    // Insert number block
    await keyDown(this.browser, 2);
    await keyRight(this.browser);
    // Choose.
    await sendKeyAndWait(this.browser, Key.Enter);
    // Confirm position.
    await sendKeyAndWait(this.browser, Key.Enter);

    // Assert inserted at the top-level due to immovable block occupying the
    // selected block's input.
    chai.assert.equal('math_number', await getFocusedBlockType(this.browser));
    const focusedBlockIsParentless = await this.browser.execute(() => {
      const focusedNode = Blockly.getFocusManager().getFocusedNode();
      return (
        focusedNode instanceof Blockly.BlockSvg &&
        focusedNode.getParent() === null
      );
    });
    chai.assert.isTrue(focusedBlockIsParentless);
  });
});
