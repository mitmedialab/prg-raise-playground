/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as chai from 'chai';
import * as Blockly from 'blockly';
import {
  focusOnBlock,
  testSetup,
  testFileLocations,
  PAUSE_TIME,
  getBlockElementById,
  tabNavigateToWorkspace,
  clickBlock,
  sendKeyAndWait,
  checkForFailures,
  pause,
} from './test_setup.js';
import {Key} from 'webdriverio';

const isKeyboardNavigating = function (browser: WebdriverIO.Browser) {
  return browser.execute(() => {
    return document.body.classList.contains('blocklyKeyboardNavigation');
  });
};

suite(
  'Keyboard navigation mode set on mouse or keyboard interaction',
  function () {
    // Disable timeouts when non-zero PAUSE_TIME is used to watch tests run.
    if (PAUSE_TIME) this.timeout(0);

    setup(async function () {
      // Reload the page between tests
      this.browser = await testSetup(
        testFileLocations.NAVIGATION_TEST_BLOCKS,
        this.timeout(),
      );

      await pause(this.browser);

      // Reset the keyboard navigation state between tests.
      await this.browser.execute(() => {
        Blockly.keyboardNavigationController.setIsActive(false);
      });

      // Start with the workspace focused.
      await tabNavigateToWorkspace(this.browser);
    });

    teardown(async function () {
      await checkForFailures(
        this.browser,
        this.currentTest?.title,
        this.currentTest?.state,
      );
    });

    test('T to open toolbox enables keyboard mode', async function () {
      await pause(this.browser);
      await sendKeyAndWait(this.browser, 't');

      chai.assert.isTrue(await isKeyboardNavigating(this.browser));
    });

    test('M for move mode enables keyboard mode', async function () {
      await focusOnBlock(this.browser, 'controls_if_2');
      await pause(this.browser);
      await sendKeyAndWait(this.browser, 'm');

      chai.assert.isTrue(await isKeyboardNavigating(this.browser));
    });

    test('W for workspace cursor enables keyboard mode', async function () {
      await pause(this.browser);
      await sendKeyAndWait(this.browser, 'w');

      chai.assert.isTrue(await isKeyboardNavigating(this.browser));
    });

    test('X to disconnect enables keyboard mode', async function () {
      await focusOnBlock(this.browser, 'controls_if_2');
      await pause(this.browser);
      await sendKeyAndWait(this.browser, 'x');

      chai.assert.isTrue(await isKeyboardNavigating(this.browser));
    });

    test('Copy does not change keyboard mode state', async function () {
      // Make sure we're on a copyable block so that copy occurs
      await focusOnBlock(this.browser, 'controls_if_2');
      await pause(this.browser);
      await sendKeyAndWait(this.browser, [Key.Ctrl, 'c']);

      chai.assert.isFalse(await isKeyboardNavigating(this.browser));

      await this.browser.execute(() => {
        Blockly.keyboardNavigationController.setIsActive(true);
      });

      await pause(this.browser);
      await sendKeyAndWait(this.browser, [Key.Ctrl, 'c']);

      chai.assert.isTrue(await isKeyboardNavigating(this.browser));
    });

    test('Delete does not change keyboard mode state', async function () {
      // Make sure we're on a deletable block so that delete occurs
      await focusOnBlock(this.browser, 'controls_if_2');
      await pause(this.browser);
      await sendKeyAndWait(this.browser, Key.Backspace);

      chai.assert.isFalse(await isKeyboardNavigating(this.browser));

      await this.browser.execute(() => {
        Blockly.keyboardNavigationController.setIsActive(true);
      });

      // Focus a different deletable block
      await focusOnBlock(this.browser, 'controls_if_1');
      await pause(this.browser);
      await sendKeyAndWait(this.browser, Key.Backspace);

      chai.assert.isTrue(await isKeyboardNavigating(this.browser));
    });

    test('Right clicking a block disables keyboard mode', async function () {
      await this.browser.execute(() => {
        Blockly.keyboardNavigationController.setIsActive(true);
      });

      await pause(this.browser);
      // Right click a block
      await clickBlock(this.browser, 'controls_if_1', {button: 'right'});
      await pause(this.browser);

      chai.assert.isFalse(await isKeyboardNavigating(this.browser));
    });

    test('Dragging a block with mouse disables keyboard mode', async function () {
      await this.browser.execute(() => {
        Blockly.keyboardNavigationController.setIsActive(true);
      });

      await pause(this.browser);
      // Drag a block
      const element = await getBlockElementById(this.browser, 'controls_if_1');

      await this.browser.execute(() => {
        const ws = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
        const block = ws.getBlockById('controls_if_1') as Blockly.BlockSvg;
        ws.scrollBoundsIntoView(
          block.getBoundingRectangleWithoutChildren(),
          10,
        );
      });
      await element.dragAndDrop({x: 10, y: 10});
      await pause(this.browser);

      chai.assert.isFalse(await isKeyboardNavigating(this.browser));
    });
  },
);
