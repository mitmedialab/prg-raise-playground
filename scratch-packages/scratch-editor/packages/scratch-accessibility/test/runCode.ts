/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';

import p5 from 'p5';
import {javascriptGenerator} from 'blockly/javascript';
import {ShortcutRegistry} from 'blockly';
import {utils as BlocklyUtils} from 'blockly';

/**
 *  Run generated p5.js code in the keyboard navigation test page.
 */
export function runCode() {
  const code = javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
  const p5outputDiv = document.getElementById('p5output');
  if (p5outputDiv) {
    // Clear the old canvas.
    p5outputDiv.innerHTML = '';
    // Run P5 in instance mode. The name 'sketch' matches the name used
    // in the generator for all of the p5 blocks.
    // eslint-disable-next-line new-cap
    new p5((sketch) => {
      eval(code);
    }, p5outputDiv);
  }
}

/**
 * Register a shortcut under ctrl+R to run code in the test page.
 */
export function registerRunCodeShortcut() {
  const runCodeShortcut = {
    name: 'Run code',
    preconditionFn: (workspace: Blockly.WorkspaceSvg) => {
      return true;
    },
    callback: (workspace: Blockly.WorkspaceSvg) => {
      runCode();
      return true;
    },
  };

  ShortcutRegistry.registry.register(runCodeShortcut);
  const shiftR = ShortcutRegistry.registry.createSerializedKey(
    BlocklyUtils.KeyCodes.R,
    [BlocklyUtils.KeyCodes.SHIFT],
  );
  ShortcutRegistry.registry.addKeyMapping(shiftR, runCodeShortcut.name);
}
