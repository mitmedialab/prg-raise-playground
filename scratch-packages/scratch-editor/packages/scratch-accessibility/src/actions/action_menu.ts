/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ShortcutRegistry, utils as BlocklyUtils, WidgetDiv} from 'blockly';
import * as Constants from '../constants';
import type {WorkspaceSvg} from 'blockly';
import {Navigation} from '../navigation';

const KeyCodes = BlocklyUtils.KeyCodes;
const createSerializedKey = ShortcutRegistry.registry.createSerializedKey.bind(
  ShortcutRegistry.registry,
);

/**
 * Keyboard shortcut to show the action menu on Cmd/Ctrl/Alt+Enter key.
 */
export class ActionMenu {
  /**
   * Registration name for the keyboard shortcut.
   */
  private shortcutName = Constants.SHORTCUT_NAMES.MENU;

  constructor(private navigation: Navigation) {}

  /**
   * Install this action.
   */
  install() {
    this.registerShortcut();
  }

  /**
   * Uninstall this action.
   */
  uninstall() {
    ShortcutRegistry.registry.unregister(this.shortcutName);
  }

  /**
   * Create and register the keyboard shortcut for this action.
   */
  private registerShortcut() {
    const menuShortcut: ShortcutRegistry.KeyboardShortcut = {
      name: Constants.SHORTCUT_NAMES.MENU,
      preconditionFn: (workspace) => {
        return (
          this.navigation.canCurrentlyNavigate(workspace) &&
          !workspace.isDragging()
        );
      },
      callback: (workspace) => {
        switch (this.navigation.getState()) {
          case Constants.STATE.WORKSPACE:
          case Constants.STATE.FLYOUT:
            return this.openActionMenu(workspace);
          default:
            return false;
        }
      },
      keyCodes: [
        createSerializedKey(KeyCodes.ENTER, [KeyCodes.CTRL]),
        createSerializedKey(KeyCodes.ENTER, [KeyCodes.ALT]),
        createSerializedKey(KeyCodes.ENTER, [KeyCodes.META]),
      ],
      allowCollision: true,
    };
    ShortcutRegistry.registry.register(menuShortcut, true);
  }

  /**
   * Show the action menu for the current node.
   *
   * The action menu will contain entries for relevant actions for the
   * node's location.  If the location is a block, this will include
   * the contents of the block's context menu (if any).
   *
   * Returns true if it is possible to open the action menu in the
   * current location, even if the menu was not opened due there being
   * no applicable menu items.
   *
   * @param workspace The workspace.
   */
  private openActionMenu(workspace: WorkspaceSvg): boolean {
    // TODO(#362): Pass this through the precondition and callback instead of making it up.
    const menuOpenEvent = new KeyboardEvent('keydown');

    const node = workspace.getCursor().getCurNode();
    if (!node) return false;
    // TODO(google/blockly#8847): Add typeguard for IContextMenu in core when this moves over
    if (
      'showContextMenu' in node &&
      typeof node.showContextMenu === 'function'
    ) {
      node.showContextMenu(menuOpenEvent);
    } else {
      console.info(`No action menu for node ${node}`);
      return false;
    }

    setTimeout(() => {
      WidgetDiv.getDiv()
        ?.querySelector('.blocklyMenu')
        ?.dispatchEvent(
          new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            keyCode: KeyCodes.DOWN,
            which: KeyCodes.DOWN,
            bubbles: true,
            cancelable: true,
          }),
        );
    }, 10);
    return true;
  }
}
