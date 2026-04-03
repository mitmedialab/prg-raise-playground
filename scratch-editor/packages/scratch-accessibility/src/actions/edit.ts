/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ContextMenuRegistry, Msg, keyboardNavigationController} from 'blockly';
import {Navigation} from '../navigation';
import {getMenuItem} from '../shortcut_formatting';
import * as Constants from '../constants';

/**
 * Action to edit a block.  This just moves the cursor to the first
 * field or input (if there is one), and exists as an aid to
 * navigational discoverability:
 *
 * Any time there is a cursor position that can be accessed by
 * pressing the right-arrow key, which isn't accessible by pressing
 * the down-arrow key (these positions are typically fields and value
 * inputs), a context menu item "Edit Block contents (→︎)" will be
 * shown in the block context menu.
 *
 * N.B.: This item is shown any time the cursor is on a block and not
 * in the rightmost position 'on the current line'; that means that
 * sometimes the label ("Edit block contents") is possibly misleading,
 * because it might not be the contents of the _current_ block that's
 * being edited, but rather that of a sibling or parent block.
 *
 * This action registers itself only as a context menu item, as there
 * is already a corresponding "right" shortcut item.
 */
export class EditAction {
  constructor(private navigation: Navigation) {}

  /**
   * Install this action as a context menu item.
   */
  install() {
    this.registerContextMenuAction();
  }

  /**
   * Uninstall this action as both a keyboard shortcut and a context menu item.
   * Reinstall the original context menu action if possible.
   */
  uninstall() {
    ContextMenuRegistry.registry.unregister('edit');
  }

  /**
   * Register the edit block action as a context menu item on blocks.
   */
  private registerContextMenuAction() {
    const editAboveItem: ContextMenuRegistry.RegistryItem = {
      displayText: getMenuItem(
        Msg['EDIT_BLOCK_CONTENTS'],
        Constants.SHORTCUT_NAMES.RIGHT,
      ),
      preconditionFn: (scope: ContextMenuRegistry.Scope, menuOpenEvent) => {
        if (menuOpenEvent instanceof PointerEvent) return 'hidden';
        const workspace = scope.block?.workspace;
        if (!workspace || !this.navigation.canCurrentlyNavigate(workspace)) {
          return 'disabled';
        }
        const cursor = workspace.getCursor();
        if (!cursor) return 'disabled';
        return cursor.atEndOfLine() ? 'hidden' : 'enabled';
      },
      callback: (scope: ContextMenuRegistry.Scope) => {
        keyboardNavigationController.setIsActive(true);
        const workspace = scope.block?.workspace;
        if (!workspace) return false;
        workspace.getCursor()?.in();
        return true;
      },
      scopeType: ContextMenuRegistry.ScopeType.BLOCK,
      id: 'edit',
      weight: 10,
    };

    ContextMenuRegistry.registry.register(editAboveItem);
  }
}
