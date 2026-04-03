/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as chai from 'chai';
import * as Blockly from 'blockly';
import {
  testSetup,
  testFileLocations,
  PAUSE_TIME,
  getBlockElementById,
  getSelectedBlockId,
  ElementWithId,
  focusOnBlock,
  focusOnBlockField,
  blockIsPresent,
  getFocusedBlockType,
  sendKeyAndWait,
  checkForFailures,
  pause,
} from './test_setup.js';
import {Key, KeyAction, PointerAction, WheelAction} from 'webdriverio';

suite('Clipboard test', function () {
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

  test('Copy and paste while block selected', async function () {
    // Navigate to draw_circle_1.
    await focusOnBlock(this.browser, 'draw_circle_1');

    // Copy and paste
    await sendKeyAndWait(this.browser, [Key.Ctrl, 'c']);
    await sendKeyAndWait(this.browser, [Key.Ctrl, 'v']);

    const block = await getBlockElementById(this.browser, 'draw_circle_1');
    const blocks = await getSameBlocks(this.browser, block);
    const selectedId = await getSelectedBlockId(this.browser);
    chai.assert.equal(await blocks.length, 2);
    chai.assert.equal(
      selectedId,
      await blocks[1].getAttribute('data-id'),
      'New copy of block should be selected and postioned after the copied one',
    );
  });

  test('Cut and paste while block selected', async function () {
    // Navigate to draw_circle_1.
    await focusOnBlock(this.browser, 'draw_circle_1');
    const block = await getBlockElementById(this.browser, 'draw_circle_1');

    // Cut and paste
    await sendKeyAndWait(this.browser, [Key.Ctrl, 'x']);
    await block.waitForExist({reverse: true});
    await sendKeyAndWait(this.browser, [Key.Ctrl, 'v']);

    const focusedType = await getFocusedBlockType(this.browser);

    // Pasted block should be focused.
    chai.assert.equal(focusedType, 'simple_circle');
  });

  test('Copy and paste whilst dragging block', async function () {
    const initialWsBlocks = await serializeWorkspaceBlocks(this.browser);

    // Simultaneously drag block and Ctrl+C then Ctrl+V
    await performActionWhileDraggingBlock(
      this.browser,
      await getBlockElementById(this.browser, 'draw_circle_1'),
      this.browser
        .action('key')
        .down(Key.Ctrl)
        .down('c')
        .up(Key.Ctrl)
        .up('c')
        .down(Key.Ctrl)
        .down('v')
        .up(Key.Ctrl)
        .up('v'),
    );

    chai.assert.deepEqual(
      initialWsBlocks,
      await serializeWorkspaceBlocks(this.browser),
      'Blocks on the workspace should not have changed',
    );
  });

  test('Cut whilst dragging block', async function () {
    const initialWsBlocks = await serializeWorkspaceBlocks(this.browser);

    // Simultaneously drag block and Ctrl+X
    await performActionWhileDraggingBlock(
      this.browser,
      await getBlockElementById(this.browser, 'draw_circle_1'),
      this.browser.action('key').down(Key.Ctrl).down('x').up(Key.Ctrl).up('x'),
    );

    chai.assert.deepEqual(
      initialWsBlocks,
      await serializeWorkspaceBlocks(this.browser),
      'Blocks on the workspace should not have changed',
    );
  });

  test('Do not cut block while field editor is open', async function () {
    // Open a field editor
    await focusOnBlockField(this.browser, 'draw_circle_1_color', 'COLOUR');
    await pause(this.browser);
    await sendKeyAndWait(this.browser, Key.Enter);

    // Try to cut block while field editor is open
    await sendKeyAndWait(this.browser, [Key.Ctrl, 'x']);

    // Block is not deleted
    chai.assert.isTrue(
      await blockIsPresent(this.browser, 'draw_circle_1_color'),
    );
  });
});

/**
 * Gets blocks that are the same as the reference block in terms of class
 * they contain.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param block The reference element.
 * @returns A Promise that resolves to blocks that are the same as the reference block.
 */
async function getSameBlocks(
  browser: WebdriverIO.Browser,
  block: ElementWithId,
) {
  const elClass = await block.getAttribute('class');
  return browser.$$(`.${elClass.split(' ').join('.')}`);
}

/**
 * Perform actions whilst dragging a given block around.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param blockToDrag The block to drag around.
 * @param action Action to perform whilst dragging block.
 * @returns A Promise that resolves once action completes.
 */
async function performActionWhileDraggingBlock(
  browser: WebdriverIO.Browser,
  blockToDrag: ElementWithId,
  action: KeyAction | PointerAction | WheelAction,
) {
  const blockLoc = await blockToDrag.getLocation();
  const blockX = Math.round(blockLoc.x);
  const blockY = Math.round(blockLoc.y);
  await browser.actions([
    browser
      .action('pointer')
      .move(blockX, blockY)
      .down()
      .move(blockX + 20, blockY + 20)
      .move(blockX, blockY),
    action,
  ]);
  await pause(browser);
}

/**
 * Serializes workspace blocks into JSON objects.
 *
 * @param browser The active WebdriverIO Browser object.
 * @returns A Promise that resolves to serialization of workspace blocks.
 */
async function serializeWorkspaceBlocks(browser: WebdriverIO.Browser) {
  return await browser.execute(() => {
    return Blockly.serialization.workspaces.save(Blockly.getMainWorkspace());
  });
}
