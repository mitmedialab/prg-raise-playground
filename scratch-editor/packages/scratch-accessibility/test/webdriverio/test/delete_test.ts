/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as chai from 'chai';
import {
  blockIsPresent,
  focusOnBlock,
  getCurrentFocusedBlockId,
  getFocusedBlockType,
  moveToToolboxCategory,
  testSetup,
  testFileLocations,
  PAUSE_TIME,
  tabNavigateToWorkspace,
  sendKeyAndWait,
  keyRight,
  focusOnBlockField,
  checkForFailures,
  pause,
} from './test_setup.js';
import {Key} from 'webdriverio';

suite('Deleting Blocks', function () {
  // Disable timeouts when non-zero PAUSE_TIME is used to watch tests run.
  if (PAUSE_TIME) this.timeout(0);

  // Clear the workspace and load start blocks.
  setup(async function () {
    this.browser = await testSetup(
      testFileLocations.NAVIGATION_TEST_BLOCKS,
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

  test('Deleting block selects parent block', async function () {
    await focusOnBlock(this.browser, 'controls_if_2');
    await pause(this.browser);

    chai
      .expect(await blockIsPresent(this.browser, 'controls_if_2'))
      .equal(true);

    await sendKeyAndWait(this.browser, Key.Backspace);

    chai
      .expect(await blockIsPresent(this.browser, 'controls_if_2'))
      .equal(false);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .to.include('controls_if_1');
  });

  test('Cutting block selects parent block', async function () {
    await focusOnBlock(this.browser, 'controls_if_2');
    await pause(this.browser);

    chai
      .expect(await blockIsPresent(this.browser, 'controls_if_2'))
      .equal(true);

    await sendKeyAndWait(this.browser, [Key.Ctrl, 'x']);

    chai
      .expect(await blockIsPresent(this.browser, 'controls_if_2'))
      .equal(false);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .to.include('controls_if_1');
  });

  test('Deleting block also deletes children and inputs', async function () {
    await focusOnBlock(this.browser, 'controls_if_2');
    await pause(this.browser);

    chai
      .expect(await blockIsPresent(this.browser, 'logic_boolean_1'))
      .equal(true);
    chai.expect(await blockIsPresent(this.browser, 'text_print_1')).equal(true);

    await sendKeyAndWait(this.browser, Key.Backspace);

    chai
      .expect(await blockIsPresent(this.browser, 'logic_boolean_1'))
      .equal(false);
    chai
      .expect(await blockIsPresent(this.browser, 'text_print_1'))
      .equal(false);
  });

  test('Cutting block also removes children and inputs', async function () {
    await focusOnBlock(this.browser, 'controls_if_2');
    await pause(this.browser);

    chai
      .expect(await blockIsPresent(this.browser, 'logic_boolean_1'))
      .equal(true);
    chai.expect(await blockIsPresent(this.browser, 'text_print_1')).equal(true);

    await sendKeyAndWait(this.browser, [Key.Ctrl, 'x']);

    chai
      .expect(await blockIsPresent(this.browser, 'logic_boolean_1'))
      .equal(false);
    chai
      .expect(await blockIsPresent(this.browser, 'text_print_1'))
      .equal(false);
  });

  test('Deleting inline input selects parent block', async function () {
    await focusOnBlock(this.browser, 'logic_boolean_1');
    await pause(this.browser);

    chai
      .expect(await blockIsPresent(this.browser, 'logic_boolean_1'))
      .equal(true);

    await sendKeyAndWait(this.browser, Key.Backspace);

    chai
      .expect(await blockIsPresent(this.browser, 'logic_boolean_1'))
      .equal(false);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .to.include('controls_if_2');
  });

  test('Cutting inline input selects parent block', async function () {
    await focusOnBlock(this.browser, 'logic_boolean_1');
    await pause(this.browser);

    chai
      .expect(await blockIsPresent(this.browser, 'logic_boolean_1'))
      .equal(true);

    await sendKeyAndWait(this.browser, [Key.Ctrl, 'x']);

    chai
      .expect(await blockIsPresent(this.browser, 'logic_boolean_1'))
      .equal(false);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .to.include('controls_if_2');
  });

  test('Deleting stranded block selects top block', async function () {
    // Deleting a stranded block should result in the workspace being
    // focused, which then focuses the top block. If that
    // behavior ever changes, this test should be updated as well.
    // We want deleting a block to focus the workspace, whatever that
    // means at the time.
    await tabNavigateToWorkspace(this.browser);
    await pause(this.browser);

    // The test workspace doesn't already contain a stranded block, so add one.
    await moveToToolboxCategory(this.browser, 'Math');
    await pause(this.browser);
    // Move to flyout.
    await keyRight(this.browser);
    // Select number block.
    await sendKeyAndWait(this.browser, Key.Enter);
    // Confirm move.
    await sendKeyAndWait(this.browser, Key.Enter);

    chai.assert.equal('math_number', await getFocusedBlockType(this.browser));

    await sendKeyAndWait(this.browser, Key.Backspace);

    chai.assert.equal(
      await getCurrentFocusedBlockId(this.browser),
      'p5_setup_1',
    );
  });

  test('Cutting stranded block selects top block', async function () {
    await tabNavigateToWorkspace(this.browser);
    await pause(this.browser);

    // The test workspace doesn't already contain a stranded block, so add one.
    await moveToToolboxCategory(this.browser, 'Math');
    await pause(this.browser);
    // Move to flyout.
    await keyRight(this.browser);
    // Select number block.
    await sendKeyAndWait(this.browser, Key.Enter);
    // Confirm move.
    await sendKeyAndWait(this.browser, Key.Enter);

    chai.assert.equal('math_number', await getFocusedBlockType(this.browser));

    await sendKeyAndWait(this.browser, [Key.Ctrl, 'x']);

    chai.assert.equal(
      await getCurrentFocusedBlockId(this.browser),
      'p5_setup_1',
    );
  });

  test('Do not delete block while field editor is open', async function () {
    // Open a field editor
    await focusOnBlockField(this.browser, 'colour_picker_1', 'COLOUR');
    await pause(this.browser);
    await sendKeyAndWait(this.browser, Key.Enter);

    // Try to delete block while field editor is open
    await sendKeyAndWait(this.browser, Key.Backspace);

    // Block is not deleted
    chai.assert.isTrue(await blockIsPresent(this.browser, 'colour_picker_1'));
  });
});
