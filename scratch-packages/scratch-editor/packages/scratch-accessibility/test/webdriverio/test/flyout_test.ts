/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as chai from 'chai';
import * as Blockly from 'blockly';
import * as webdriverio from 'webdriverio';
import {
  testSetup,
  testFileLocations,
  PAUSE_TIME,
  tabNavigateForward,
  keyDown,
  tabNavigateBackward,
  tabNavigateToWorkspace,
  sendKeyAndWait,
  keyRight,
  getCurrentFocusNodeId,
  getCurrentFocusedBlockId,
  tabNavigateToToolbox,
  checkForFailures,
  pause,
  setSynchronizeCoreBlocklyRendering,
} from './test_setup.js';

suite('Toolbox and flyout test', function () {
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

  test('Tab navigating to toolbox should open flyout', async function () {
    // Two tabs should navigate to the toolbox (initial element is skipped).
    await tabNavigateForward(this.browser);

    await tabNavigateForward(this.browser);

    // The flyout should now be open.
    const flyoutIsOpen = await checkIfFlyoutIsOpen(this.browser);
    chai.assert.isTrue(flyoutIsOpen);
  });

  test('Tab navigating to flyout should auto-select first block', async function () {
    // Three tabs should navigate to the flyout (initial element is skipped).
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);

    await tabNavigateForward(this.browser);

    // The top block of the category should be automatically selected. See:
    // https://github.com/google/blockly/issues/8978.
    const blockId = await getCurrentFocusedBlockId(this.browser);
    chai.assert.strictEqual(blockId, 'if_block');
  });

  test('Tab navigating to toolbox then right arrow key should auto-select first block in flyout', async function () {
    // Two tabs should navigate to the toolbox (initial element is skipped). One
    // right arrow key should select a block on the flyout.
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);

    await keyRight(this.browser);

    // The top block of the category should be automatically selected. See:
    // https://github.com/google/blockly/issues/8978.
    const blockId = await getCurrentFocusedBlockId(this.browser);
    chai.assert.strictEqual(blockId, 'if_block');
  });

  test('Keyboard nav to different toolbox category should auto-select first block', async function () {
    // Two tabs should navigate to the toolbox (initial element is skipped),
    // then keys for a different category with a tab to select the flyout.
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);

    await keyDown(this.browser, 3);
    await tabNavigateForward(this.browser);

    // The top block of the category should be automatically selected.
    const blockId = await getCurrentFocusedBlockId(this.browser);
    chai.assert.strictEqual(blockId, 'text_block');
  });

  test('Keyboard nav to different toolbox category and block should select different block', async function () {
    // Two tabs should navigate to the toolbox (initial element is skipped),
    // then keys for a different category with a tab to select the flyout and
    // finally keys to select a different block.
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);

    await keyDown(this.browser, 3);
    await tabNavigateForward(this.browser);
    await keyDown(this.browser, 2);

    // A non-top blockshould be manually selected.
    const blockId = await getCurrentFocusedBlockId(this.browser);
    chai.assert.strictEqual(blockId, 'append_text_block');
  });

  test('Tab navigate away from toolbox restores focus to initial element', async function () {
    // Two tabs should navigate to the toolbox. One tab back should leave it.
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);

    await tabNavigateBackward(this.browser);

    // Focus should restore to the initial div element. See:
    // https://github.com/google/blockly-keyboard-experimentation/issues/523.
    const activeElementId = await this.browser.execute(
      () => document.activeElement?.id,
    );
    chai.assert.strictEqual(activeElementId, 'focusableDiv');
  });

  test('Tab navigate away from toolbox closes flyout', async function () {
    // Two tabs should navigate to the toolbox. One tab back should leave it.
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);

    await tabNavigateBackward(this.browser);

    // The flyout should be closed since the toolbox lost focus. See:
    // https://github.com/google/blockly/issues/8970.
    const flyoutIsOpen = await checkIfFlyoutIsOpen(this.browser);
    chai.assert.isFalse(flyoutIsOpen);
  });

  test('Tab navigate away from flyout to toolbox and away closes flyout', async function () {
    // Three tabs should navigate to the flyout, and two tabs back should close.
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);

    await tabNavigateBackward(this.browser);
    await tabNavigateBackward(this.browser);

    // The flyout should be closed since the toolbox lost focus.
    const flyoutIsOpen = await checkIfFlyoutIsOpen(this.browser);
    chai.assert.isFalse(flyoutIsOpen);
  });

  test('Tabbing to the workspace should close the flyout', async function () {
    await tabNavigateToWorkspace(this.browser);
    await pause(this.browser);

    // The flyout should be closed since it lost focus.
    const flyoutIsOpen = await checkIfFlyoutIsOpen(this.browser);
    chai.assert.isFalse(flyoutIsOpen);
  });

  test('Tabbing to the workspace after selecting flyout block should close the flyout', async function () {
    // Two tabs should navigate to the toolbox (initial element is skipped),
    // then use right key to specifically navigate into the flyout before
    // navigating to the workspace.
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);

    await keyRight(this.browser);
    await tabNavigateForward(this.browser);

    // The flyout should be closed since it lost focus. See:
    // https://github.com/google/blockly-keyboard-experimentation/issues/547.
    const flyoutIsOpen = await checkIfFlyoutIsOpen(this.browser);
    chai.assert.isFalse(flyoutIsOpen);
  });

  test('Tabbing to the workspace after selecting flyout block via workspace toolbox shortcut should close the flyout', async function () {
    await tabNavigateToWorkspace(this.browser);

    await sendKeyAndWait(this.browser, 't');
    await keyRight(this.browser);
    await tabNavigateForward(this.browser);

    // The flyout should now be closed and unfocused. See:
    // https://github.com/google/blockly/pull/9079#issuecomment-2913759646.
    const flyoutIsOpen = await checkIfFlyoutIsOpen(this.browser);
    chai.assert.isFalse(flyoutIsOpen);
  });

  test('Tabbing back from workspace should reopen the flyout', async function () {
    await tabNavigateToWorkspace(this.browser);

    await tabNavigateBackward(this.browser);

    // The flyout should be open again since the toolbox is again focused. See:
    // https://github.com/google/blockly/issues/8965.
    const flyoutIsOpen = await checkIfFlyoutIsOpen(this.browser);
    chai.assert.isTrue(flyoutIsOpen);
  });

  test('Navigation position in workspace should be retained when tabbing to flyout and back', async function () {
    // Navigate to the workspace and select a non-default block.
    await tabNavigateToWorkspace(this.browser);

    // Note that two tabs are needed here to move past the flyout.
    await keyDown(this.browser, 3);
    await tabNavigateBackward(this.browser);
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);

    // The previously selected block should be retained upon returning. See:
    // https://github.com/google/blockly/issues/8965#issuecomment-2900479280.
    const blockId = await getCurrentFocusedBlockId(this.browser);
    chai.assert.strictEqual(blockId, 'p5_draw_1');
  });

  test('Clicking outside Blockly with focused toolbox closes the flyout', async function () {
    // Two tabs should navigate to the toolbox. One click to unfocus.
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);

    const elem = this.browser.$('#focusableDiv');
    await elem.click();

    // The flyout should be closed due to clicking an outside element.
    const flyoutIsOpen = await checkIfFlyoutIsOpen(this.browser);
    chai.assert.isFalse(flyoutIsOpen);
  });

  test('Clicking outside Blockly with focused flyout closes the flyout', async function () {
    // Two tabs should navigate to the toolbox. One key to select the flyout.
    await tabNavigateForward(this.browser);
    await tabNavigateForward(this.browser);
    await keyRight(this.browser);

    const elem = this.browser.$('#focusableDiv');
    await elem.click();

    // The flyout should be closed due to clicking an outside element. See:
    // https://github.com/google/blockly/pull/9079#issuecomment-2914628810.
    const flyoutIsOpen = await checkIfFlyoutIsOpen(this.browser);
    chai.assert.isFalse(flyoutIsOpen);
  });

  test('Clicking on toolbox category focuses it and opens flyout', async function () {
    const elemId = await findToolboxCategoryIdByName(this.browser, 'Loops');
    const elem = this.browser.$(`#${elemId}`);
    await elem.click();

    // The clicked category should now be focused.
    const focusedId = await getCurrentFocusNodeId(this.browser);
    const flyoutIsOpen = await checkIfFlyoutIsOpen(this.browser);
    chai.assert.strictEqual(focusedId, elemId);
    chai.assert.isTrue(flyoutIsOpen);
  });

  suite('Flyout buttons', function () {
    setup(async function () {
      // New toolbox definition
      const toolbox = {
        'kind': 'categoryToolbox',
        'contents': [
          {
            'kind': 'category',
            'name': 'test category',
            'contents': [
              {
                'kind': 'button',
                'text': 'A button',
                // Note lowercase
                'callbackkey': 'buttonCallback',
              },
              {
                'kind': 'button',
                'text': 'Second button',
                // Note camelCase
                'callbackKey': 'buttonCallback',
              },
            ],
          },
        ],
      };

      // Replace toolbox contents & register button callback
      await this.browser.execute((toolboxDef) => {
        const ws = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
        ws.updateToolbox(toolboxDef);
        ws.registerButtonCallback('buttonCallback', () => {
          alert('Button pressed');
        });
      }, toolbox);
    });
    teardown(async function () {
      try {
        await this.browser.acceptAlert();
      } catch {
        // Don't do anything if the alert isn't present, the test already failed elsewhere.
      }
    });
    test('callbackkey is activated with enter', async function () {
      // Rendering synchronization must be disabled since this test opens an
      // alert dialog. See the function's documentation for more specifics.
      setSynchronizeCoreBlocklyRendering(false);
      await tabNavigateToToolbox(this.browser);
      await pause(this.browser);

      // First thing in the toolbox is the first button
      // Press Enter to activate it.
      await keyRight(this.browser);
      await sendKeyAndWait(this.browser, webdriverio.Key.Enter);

      // This errors if there is no alert present
      await this.browser.getAlertText();
    });

    test('callbackKey is activated with enter', async function () {
      // Rendering synchronization must be disabled since this test opens an
      // alert dialog. See the function's documentation for more specifics.
      setSynchronizeCoreBlocklyRendering(false);
      await tabNavigateToToolbox(this.browser);
      await pause(this.browser);

      // Navigate to second button.
      // Press Enter to activate it.
      await keyRight(this.browser);
      await keyDown(this.browser);
      await sendKeyAndWait(this.browser, webdriverio.Key.Enter);

      // This errors if there is no alert present
      await this.browser.getAlertText();
    });
  });
});

/**
 * Checks if the flyout is currently open.
 *
 * This throws an error if the current main workspace has no flyout.
 *
 * @param browser The active WebdriverIO Browser object.
 * @returns A promise indicating whether the flyout is currently open.
 */
async function checkIfFlyoutIsOpen(
  browser: WebdriverIO.Browser,
): Promise<boolean> {
  return await browser.execute(() => {
    const workspaceSvg = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    const flyout = workspaceSvg.getFlyout();
    if (!flyout) throw new Error('Workspace has no flyout.');
    return flyout.isVisible();
  });
}

/**
 * Finds the element ID of the toolbox category with the specified name.
 *
 * This throws an error if the current main workspace has no toolbox or the
 * toolbox does not have a category with the specified name.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param name The name of the category to find.
 * @returns A promise with the focusable element ID of the sought category.
 */
async function findToolboxCategoryIdByName(
  browser: WebdriverIO.Browser,
  name: string,
): Promise<string> {
  return await browser.execute((name) => {
    const workspaceSvg = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    const toolbox = workspaceSvg.getToolbox() as Blockly.Toolbox;
    if (!toolbox) throw new Error('Workspace has no toolbox.');

    for (const item of toolbox.getToolboxItems()) {
      if (item instanceof Blockly.ToolboxCategory && item.getName() === name) {
        return item.getFocusableElement().id;
      }
    }

    throw new Error(`No category found with name: ${name}.`);
  }, name);
}
