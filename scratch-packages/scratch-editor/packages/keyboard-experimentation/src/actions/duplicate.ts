/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BlockSvg,
  clipboard,
  ContextMenuRegistry,
  type ICopyable,
  ShortcutRegistry,
  utils,
  comments,
  type ICopyData,
} from 'blockly';
import * as Constants from '../constants';
import {getMenuItem} from '../shortcut_formatting';

/**
 * Duplicate action that adds a keyboard shortcut for duplicate and overrides
 * the context menu item to show it if the context menu item is registered.
 */
export class DuplicateAction {
  private duplicateShortcut: ShortcutRegistry.KeyboardShortcut | null = null;
  private uninstallHandlers: Array<() => void> = [];

  /**
   * Install the shortcuts and override context menu entries.
   *
   * No change is made if there's already a 'duplicate' shortcut.
   */
  install() {
    this.duplicateShortcut = this.registerDuplicateShortcut();
    if (this.duplicateShortcut) {
      this.uninstallHandlers.push(
        overrideContextMenuItemForShortcutText(
          'blockDuplicate',
          Constants.SHORTCUT_NAMES.DUPLICATE,
        ),
      );
      this.uninstallHandlers.push(
        overrideContextMenuItemForShortcutText(
          'commentDuplicate',
          Constants.SHORTCUT_NAMES.DUPLICATE,
        ),
      );
    }
  }

  /**
   * Unregister the shortcut and reinstate the original context menu entries.
   */
  uninstall() {
    this.uninstallHandlers.forEach((handler) => handler());
    this.uninstallHandlers.length = 0;
    if (this.duplicateShortcut) {
      ShortcutRegistry.registry.unregister(this.duplicateShortcut.name);
    }
  }

  /**
   * Create and register the keyboard shortcut for the duplicate action.
   * Same behaviour as for the core context menu.
   * Skipped if there is a shortcut with a matching name already.
   */
  private registerDuplicateShortcut(): ShortcutRegistry.KeyboardShortcut | null {
    if (
      ShortcutRegistry.registry.getRegistry()[
        Constants.SHORTCUT_NAMES.DUPLICATE
      ]
    ) {
      return null;
    }

    const shortcut: ShortcutRegistry.KeyboardShortcut = {
      name: Constants.SHORTCUT_NAMES.DUPLICATE,
      // Equivalent to the core context menu entry.
      preconditionFn(workspace, scope) {
        const {focusedNode} = scope;
        if (focusedNode instanceof BlockSvg) {
          return (
            !focusedNode.isInFlyout &&
            focusedNode.isDeletable() &&
            focusedNode.isMovable() &&
            focusedNode.isDuplicatable()
          );
        } else if (focusedNode instanceof comments.RenderedWorkspaceComment) {
          return focusedNode.isMovable();
        }
        return false;
      },
      callback(workspace, e, shortcut, scope) {
        const copyable = scope.focusedNode as ICopyable<ICopyData>;
        const data = copyable.toCopyData();
        if (!data) return false;
        return !!clipboard.paste(data, workspace);
      },
      keyCodes: [utils.KeyCodes.D],
    };
    ShortcutRegistry.registry.register(shortcut);
    return shortcut;
  }
}

/**
 * Replace a context menu item to add shortcut text to its displayText.
 *
 * Nothing happens if there is not a matching context menu item registered.
 *
 * @param registryId Context menu registry id to replace if present.
 * @param shortcutName The corresponding shortcut name.
 * @returns A function to reinstate the original context menu entry.
 */
function overrideContextMenuItemForShortcutText(
  registryId: string,
  shortcutName: string,
): () => void {
  const original = ContextMenuRegistry.registry.getItem(registryId);
  if (!original || 'separator' in original) {
    return () => {};
  }

  const override: ContextMenuRegistry.RegistryItem = {
    ...original,
    displayText: (scope: ContextMenuRegistry.Scope) => {
      const displayText =
        typeof original.displayText === 'function'
          ? original.displayText(scope)
          : original.displayText;
      if (displayText instanceof HTMLElement) {
        // We can't cope in this scenario.
        return displayText;
      }
      return getMenuItem(displayText, shortcutName);
    },
  };
  ContextMenuRegistry.registry.unregister(registryId);
  ContextMenuRegistry.registry.register(override);

  return () => {
    ContextMenuRegistry.registry.unregister(registryId);
    ContextMenuRegistry.registry.register(original);
  };
}
