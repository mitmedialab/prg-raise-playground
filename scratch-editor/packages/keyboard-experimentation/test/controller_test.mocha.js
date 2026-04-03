/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jsdom-global/register';
import * as Blockly from 'blockly';
import {KeyboardNavigation} from '../src/index';
import {registerFlyoutCursor} from '../src/flyout_cursor';
import {registerNavigationDeferringToolbox} from '../src/navigation_deferring_toolbox';

suite('NavigationController', function () {
  setup(function () {
    this.jsdomCleanup = require('jsdom-global')(
      '<!DOCTYPE html><div id="blocklyDiv"></div>',
      {pretendToBeVisual: true},
    );

    // Reset registries to their initial state.
    Blockly.ShortcutRegistry.registry.reset();
    Blockly.ShortcutItems.registerDefaultShortcuts();
    Blockly.ContextMenuRegistry.registry.reset();
    Blockly.ContextMenuItems.registerDefaultOptions();

    // Create the workspace for the test.
    registerFlyoutCursor();
    registerNavigationDeferringToolbox();
    this.workspace = Blockly.inject('blocklyDiv');
  });

  teardown(function () {
    this.jsdomCleanup();
  });

  test('Dispose and reinitialize the navigation controller without crashing', async function () {
    const kb = new KeyboardNavigation(this.workspace);
    kb.navigationController.dispose();
    kb.navigationController.init();
    kb.navigationController.dispose();
  });

  test('Dispose plugin and reinitialize the navigation controller without crashing', async function () {
    const kb = new KeyboardNavigation(this.workspace);
    kb.dispose();
    kb.navigationController.init();
    kb.navigationController.dispose();
  });

  test('Dispose controller and create a new KeyboardNavigation instance without crashing', async function () {
    const kb = new KeyboardNavigation(this.workspace);
    kb.navigationController.dispose();
    new KeyboardNavigation(this.workspace);
  });

  test('Dispose and create a new KeyboardNavigation instance without crashing', async function () {
    const kb = new KeyboardNavigation(this.workspace);
    kb.dispose();
    new KeyboardNavigation(this.workspace);
  });

  test('Add a workspace to existing instance without crashing', async function () {
    const kb = new KeyboardNavigation(this.workspace);
    const workspace2 = Blockly.inject('blocklyDiv');
    kb.navigationController.addWorkspace(workspace2);
    kb.dispose();
  });
});
