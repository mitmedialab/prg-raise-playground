/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as chai from 'chai';
import * as Blockly from 'blockly';
import {
  isDragging,
  focusOnBlock,
  focusOnBlockField,
  getCurrentFocusNodeId,
  getCurrentFocusedBlockId,
  getFocusedFieldName,
  testSetup,
  testFileLocations,
  PAUSE_TIME,
  sendKeyAndWait,
  tabNavigateToWorkspace,
  keyLeft,
  keyRight,
  keyUp,
  keyDown,
  checkForFailures,
  pause,
} from './test_setup.js';
import {Key} from 'webdriverio';

suite('Keyboard navigation on Blocks', function () {
  // Disable timeouts when non-zero PAUSE_TIME is used to watch tests run.
  if (PAUSE_TIME) this.timeout(0);

  // Clear the workspace and load start blocks.
  suiteSetup(async function () {
    this.browser = await testSetup(
      testFileLocations.NAVIGATION_TEST_BLOCKS,
      this.timeout(),
    );
  });

  teardown(async function () {
    await checkForFailures(
      this.browser,
      this.currentTest?.title,
      this.currentTest?.state,
    );
  });

  test('Default workspace', async function () {
    const blockCount = await this.browser.execute(() => {
      return Blockly.getMainWorkspace().getAllBlocks(false).length;
    });

    chai.assert.equal(blockCount, 16);
  });

  test('Selected block', async function () {
    await tabNavigateToWorkspace(this.browser);
    await pause(this.browser);

    await keyDown(this.browser, 14);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('controls_if_2');
  });

  test('Down from statement block selects next block across stacks', async function () {
    await focusOnBlock(this.browser, 'p5_canvas_1');
    await pause(this.browser);
    await keyDown(this.browser);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('p5_draw_1');
  });

  test('Up from statement block selects previous block', async function () {
    await focusOnBlock(this.browser, 'simple_circle_1');
    await pause(this.browser);
    await keyUp(this.browser);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('draw_emoji_1');
  });

  test('Down from parent block selects first child block', async function () {
    await focusOnBlock(this.browser, 'p5_setup_1');
    await pause(this.browser);
    await keyDown(this.browser);
    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('p5_canvas_1');
  });

  test('Up from child block selects parent block', async function () {
    await focusOnBlock(this.browser, 'p5_canvas_1');
    await pause(this.browser);
    await keyUp(this.browser);
    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('p5_setup_1');
  });

  test('Right from block selects first field', async function () {
    await focusOnBlock(this.browser, 'p5_canvas_1');
    await pause(this.browser);
    await keyRight(this.browser);

    chai
      .expect(await getCurrentFocusNodeId(this.browser))
      .to.include('p5_canvas_1_field_');

    chai.assert.equal(await getFocusedFieldName(this.browser), 'WIDTH');
  });

  test('Right from block selects first inline input', async function () {
    await focusOnBlock(this.browser, 'simple_circle_1');
    await pause(this.browser);
    await keyRight(this.browser);

    chai.assert.equal(
      await getCurrentFocusedBlockId(this.browser),
      'colour_picker_1',
    );
  });

  test('Up from inline input selects statement block', async function () {
    await focusOnBlock(this.browser, 'math_number_2');
    await pause(this.browser);
    await keyUp(this.browser);

    chai.assert.equal(
      await getCurrentFocusedBlockId(this.browser),
      'controls_repeat_ext_1',
    );
  });

  test('Left from first inline input selects block', async function () {
    await focusOnBlock(this.browser, 'math_number_2');
    await pause(this.browser);
    await keyLeft(this.browser);

    chai.assert.equal(
      await getCurrentFocusedBlockId(this.browser),
      'math_modulo_1',
    );
  });

  test('Right from first inline input selects second inline input', async function () {
    await focusOnBlock(this.browser, 'math_number_2');
    await pause(this.browser);
    await keyRight(this.browser);

    chai.assert.equal(
      await getCurrentFocusedBlockId(this.browser),
      'math_number_3',
    );
  });

  test('Left from second inline input selects first inline input', async function () {
    await focusOnBlock(this.browser, 'math_number_3');
    await pause(this.browser);
    await keyLeft(this.browser);

    chai.assert.equal(
      await getCurrentFocusedBlockId(this.browser),
      'math_number_2',
    );
  });

  test('Right from last inline input selects next block', async function () {
    await focusOnBlock(this.browser, 'colour_picker_1');
    await pause(this.browser);
    await keyRight(this.browser);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('controls_repeat_ext_1');
  });

  test('Down from inline input selects next block', async function () {
    await focusOnBlock(this.browser, 'colour_picker_1');
    await pause(this.browser);
    await keyDown(this.browser);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('controls_repeat_ext_1');
  });

  test("Down from inline input selects block's child block", async function () {
    await focusOnBlock(this.browser, 'logic_boolean_1');
    await pause(this.browser);
    await keyDown(this.browser);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('text_print_1');
  });

  test('Right from text block selects shadow block then field', async function () {
    await focusOnBlock(this.browser, 'text_print_1');
    await pause(this.browser);
    await keyRight(this.browser);

    chai.assert.equal(await getCurrentFocusedBlockId(this.browser), 'text_1');

    await keyRight(this.browser);

    chai
      .expect(await getCurrentFocusNodeId(this.browser))
      .to.include('text_1_field_');

    await keyRight(this.browser);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('controls_repeat_1');
  });

  test('Losing focus cancels move', async function () {
    await focusOnBlock(this.browser, 'text_print_1');
    await sendKeyAndWait(this.browser, 'm');

    chai.assert.isTrue(await isDragging(this.browser));

    await sendKeyAndWait(this.browser, Key.Tab);

    chai.assert.isFalse(await isDragging(this.browser));
  });
});

suite('Keyboard navigation on Fields', function () {
  // Disable timeouts when non-zero PAUSE_TIME is used to watch tests run.
  if (PAUSE_TIME) this.timeout(0);

  // Clear the workspace and load start blocks.
  suiteSetup(async function () {
    this.browser = await testSetup(
      testFileLocations.NAVIGATION_TEST_BLOCKS,
      this.timeout(),
    );
  });

  teardown(async function () {
    await checkForFailures(
      this.browser,
      this.currentTest?.title,
      this.currentTest?.state,
    );
  });

  test('Up from first field selects block', async function () {
    await focusOnBlockField(this.browser, 'p5_canvas_1', 'WIDTH');
    await pause(this.browser);
    await keyUp(this.browser);

    chai.assert.equal(
      await getCurrentFocusedBlockId(this.browser),
      'p5_canvas_1',
    );
  });

  test('Left from first field selects block', async function () {
    await focusOnBlockField(this.browser, 'p5_canvas_1', 'WIDTH');
    await pause(this.browser);
    await keyLeft(this.browser);

    chai.assert.equal(
      await getCurrentFocusedBlockId(this.browser),
      'p5_canvas_1',
    );
  });

  test('Right from first field selects second field', async function () {
    await focusOnBlockField(this.browser, 'p5_canvas_1', 'WIDTH');
    await pause(this.browser);
    await keyRight(this.browser);

    chai
      .expect(await getCurrentFocusNodeId(this.browser))
      .to.include('p5_canvas_1_field_');

    chai.assert.equal(await getFocusedFieldName(this.browser), 'HEIGHT');
  });

  test('Left from second field selects first field', async function () {
    await focusOnBlockField(this.browser, 'p5_canvas_1', 'HEIGHT');
    await pause(this.browser);
    await keyLeft(this.browser);

    chai
      .expect(await getCurrentFocusNodeId(this.browser))
      .to.include('p5_canvas_1_field_');

    chai.assert.equal(await getFocusedFieldName(this.browser), 'WIDTH');
  });

  test('Right from second field selects next block', async function () {
    await focusOnBlockField(this.browser, 'p5_canvas_1', 'HEIGHT');
    await pause(this.browser);
    await keyRight(this.browser);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('p5_draw_1');
  });

  test('Down from field selects next block', async function () {
    await focusOnBlockField(this.browser, 'p5_canvas_1', 'WIDTH');
    await pause(this.browser);
    await keyDown(this.browser);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('p5_draw_1');
  });

  test("Down from field selects block's child block", async function () {
    await focusOnBlockField(this.browser, 'controls_repeat_1', 'TIMES');
    await pause(this.browser);
    await keyDown(this.browser);

    chai
      .expect(await getCurrentFocusedBlockId(this.browser))
      .equal('draw_emoji_1');
  });

  test('Do not navigate while field editor is open', async function () {
    // Open a field editor dropdown
    await focusOnBlockField(this.browser, 'logic_boolean_1', 'BOOL');
    await pause(this.browser);
    await sendKeyAndWait(this.browser, Key.Enter);

    // Try to navigate to a different block
    await keyRight(this.browser);

    // The same field should still be focused
    chai.assert.equal(await getFocusedFieldName(this.browser), 'BOOL');
  });

  test('Do not reopen field editor when handling enter to make a choice inside the editor', async function () {
    // Open colour picker
    await focusOnBlockField(this.browser, 'colour_picker_1', 'COLOUR');
    await pause(this.browser);
    await sendKeyAndWait(this.browser, Key.Enter);

    // Move right to pick a new colour.
    await keyRight(this.browser);
    // Enter to choose.
    await sendKeyAndWait(this.browser, Key.Enter);

    // Focus seems to take longer than a single pause to settle.
    await this.browser.waitUntil(
      () =>
        this.browser.execute(() =>
          document.activeElement?.classList.contains('blocklyActiveFocus'),
        ),
      {timeout: 1000},
    );
  });
});
