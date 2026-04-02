/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ShortcutRegistry,
  WorkspaceSvg,
  BlockSvg,
  navigateStacks,
  isSelectable,
  utils,
} from 'blockly/core';
import * as Constants from '../constants';

/**
 * Class for registering a shortcut for quick movement between top level bounds
 * in the workspace.
 */
export class StackNavigationAction {
  private stackShortcuts: ShortcutRegistry.KeyboardShortcut[] = [];

  install() {
    const preconditionFn = (workspace: WorkspaceSvg) =>
      !!this.getCurNodeRoot(workspace);

    const previousStackShortcut: ShortcutRegistry.KeyboardShortcut = {
      name: Constants.SHORTCUT_NAMES.PREVIOUS_STACK,
      preconditionFn,
      callback: (workspace) => {
        return this.navigate(workspace, -1);
      },
      keyCodes: [utils.KeyCodes.B],
    };

    const nextStackShortcut: ShortcutRegistry.KeyboardShortcut = {
      name: Constants.SHORTCUT_NAMES.NEXT_STACK,
      preconditionFn,
      callback: (workspace) => {
        return this.navigate(workspace, 1);
      },
      keyCodes: [utils.KeyCodes.N],
    };

    ShortcutRegistry.registry.register(previousStackShortcut);
    this.stackShortcuts.push(previousStackShortcut);
    ShortcutRegistry.registry.register(nextStackShortcut);
    this.stackShortcuts.push(nextStackShortcut);
  }

  private getCurNodeRoot(workspace: WorkspaceSvg) {
    const cursor = workspace.getCursor();
    // The fallback case includes workspace comments.
    return cursor.getSourceBlock()?.getRootBlock() ?? cursor.getCurNode();
  }

  private navigate(workspace: WorkspaceSvg, delta: number) {
    const curNodeRoot = this.getCurNodeRoot(workspace);
    if (!curNodeRoot || !isSelectable(curNodeRoot)) {
      return false;
    }

    let nextRoot = navigateStacks(curNodeRoot, delta);
    if (!nextRoot) return false;
    if (nextRoot instanceof BlockSvg) {
      nextRoot = nextRoot.getRootBlock();
    }
    workspace.getCursor().setCurNode(nextRoot);
    return true;
  }

  /**
   * Unregisters the shortcut.
   */
  uninstall() {
    this.stackShortcuts.forEach((shortcut) =>
      ShortcutRegistry.registry.unregister(shortcut.name),
    );
    this.stackShortcuts.length = 0;
  }
}
