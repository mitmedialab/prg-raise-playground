/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as chai from 'chai';
import * as Blockly from 'blockly';
import {
  focusedTreeIsMainWorkspace,
  focusOnBlock,
  getCurrentFocusNodeId,
  getFocusedBlockType,
  testSetup,
  testFileLocations,
  PAUSE_TIME,
  sendKeyAndWait,
  keyRight,
  keyDown,
  checkForFailures,
  pause,
} from './test_setup.js';
import {Key} from 'webdriverio';

suite('Mutator navigation', function () {
  // Disable timeouts when non-zero PAUSE_TIME is used to watch tests run.
  if (PAUSE_TIME) this.timeout(0);

  // Clear the workspace and load start blocks.
  setup(async function () {
    this.browser = await testSetup(
      testFileLocations.NAVIGATION_TEST_BLOCKS,
      this.timeout(),
    );
    this.openMutator = async () => {
      await focusOnBlock(this.browser, 'controls_if_1');
      await pause(this.browser);
      // Navigate to the mutator icon
      await keyRight(this.browser);
      // Activate the icon
      await sendKeyAndWait(this.browser, Key.Enter);
    };
  });

  teardown(async function () {
    await checkForFailures(
      this.browser,
      this.currentTest?.title,
      this.currentTest?.state,
    );
  });

  test('Enter opens mutator', async function () {
    await this.openMutator();

    // Main workspace should not be focused (because mutator workspace is)
    const mainWorkspaceFocused = await focusedTreeIsMainWorkspace(this.browser);
    chai.assert.isFalse(mainWorkspaceFocused);

    // The "if" placeholder block in the mutator should be focused
    const focusedBlockType = await getFocusedBlockType(this.browser);
    chai.assert.equal(focusedBlockType, 'controls_if_if');
  });

  test('Escape dismisses mutator', async function () {
    await this.openMutator();
    await sendKeyAndWait(this.browser, Key.Escape);

    // Main workspace should be the focused tree (since mutator workspace is gone)
    const mainWorkspaceFocused = await focusedTreeIsMainWorkspace(this.browser);
    chai.assert.isTrue(mainWorkspaceFocused);

    const mutatorIconId = await this.browser.execute(() => {
      const block = Blockly.getMainWorkspace().getBlockById('controls_if_1');
      const icon = block?.getIcon(Blockly.icons.IconType.MUTATOR);
      return icon?.getFocusableElement().id;
    });

    // Mutator icon should now be focused
    const focusedNodeId = await getCurrentFocusNodeId(this.browser);
    chai.assert.equal(mutatorIconId, focusedNodeId);
  });

  test('Escape in the mutator flyout focuses the mutator workspace', async function () {
    await this.openMutator();
    // Focus the flyout
    await sendKeyAndWait(this.browser, 't');
    // Hit escape to return focus to the mutator workspace
    await sendKeyAndWait(this.browser, Key.Escape);
    // The "if" placeholder block in the mutator should be focused
    const focusedBlockType = await getFocusedBlockType(this.browser);
    chai.assert.equal(focusedBlockType, 'controls_if_if');
  });

  test('T focuses the mutator flyout', async function () {
    await this.openMutator();
    await sendKeyAndWait(this.browser, 't');

    // The "else if" block in the mutator flyout should be focused
    const focusedBlockType = await getFocusedBlockType(this.browser);
    chai.assert.equal(focusedBlockType, 'controls_if_elseif');
  });

  test('Blocks can be inserted from the mutator flyout', async function () {
    await this.openMutator();
    await sendKeyAndWait(this.browser, 't');
    // Navigate down to the second block in the flyout
    await keyDown(this.browser);
    await pause(this.browser);
    // Hit enter to enter insert mode
    await sendKeyAndWait(this.browser, Key.Enter);
    // Hit enter again to lock it into place on the connection
    await sendKeyAndWait(this.browser, Key.Enter);

    const topBlocks = await this.browser.execute(() => {
      const focusedTree = Blockly.getFocusManager().getFocusedTree();
      if (!(focusedTree instanceof Blockly.WorkspaceSvg)) {
        throw new Error('Focused tree is not a workspace.');
      }

      return focusedTree.getAllBlocks(true).map((block) => block.type);
    });

    chai.assert.deepEqual(topBlocks, ['controls_if_if', 'controls_if_else']);
  });
});
