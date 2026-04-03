/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BlockSvg,
  Events,
  ShortcutRegistry,
  utils as BlocklyUtils,
  keyboardNavigationController,
} from 'blockly';
import * as Constants from '../constants';
import type {WorkspaceSvg} from 'blockly';
import {Navigation} from '../navigation';

const KeyCodes = BlocklyUtils.KeyCodes;

/**
 * Action to insert a block into the workspace.
 *
 * This action registers itself as both a keyboard shortcut and a context menu
 * item.
 */
export class DisconnectAction {
  /**
   * Registration name for the keyboard shortcut.
   */
  private shortcutName = Constants.SHORTCUT_NAMES.DISCONNECT;

  constructor(private navigation: Navigation) {}

  /**
   * Install this action as both a keyboard shortcut and a context menu item.
   */
  install() {
    this.registerShortcut();
  }

  /**
   * Uninstall this action as both a keyboard shortcut and a context menu item.
   * Reinstall the original context menu action if possible.
   */
  uninstall() {
    ShortcutRegistry.registry.unregister(this.shortcutName);
  }

  /**
   * Create and register the keyboard shortcut for this action.
   */
  private registerShortcut() {
    const disconnectShortcut: ShortcutRegistry.KeyboardShortcut = {
      name: this.shortcutName,
      preconditionFn: (workspace) =>
        this.navigation.canCurrentlyEdit(workspace),
      callback: (workspace) => {
        keyboardNavigationController.setIsActive(true);
        switch (this.navigation.getState()) {
          case Constants.STATE.WORKSPACE:
            this.disconnectBlocks(workspace);
            return true;
          default:
            return false;
        }
      },
      keyCodes: [KeyCodes.X],
    };
    ShortcutRegistry.registry.register(disconnectShortcut);
  }

  /**
   * Disconnects the connection that the cursor is pointing to, and bump blocks.
   * This is a no-op if the connection cannot be broken or if the cursor is not
   * pointing to a connection.
   *
   * @param workspace The workspace.
   */
  disconnectBlocks(workspace: WorkspaceSvg) {
    const cursor = workspace.getCursor();
    const curNode = cursor.getCurNode();
    if (!(curNode instanceof BlockSvg)) return;

    const healStack = !curNode.outputConnection?.isConnected();
    Events.setGroup(true);
    curNode.unplug(healStack);
    Events.setGroup(false);

    // Needed or we end up with passive focus.
    cursor.setCurNode(curNode);
  }
}
