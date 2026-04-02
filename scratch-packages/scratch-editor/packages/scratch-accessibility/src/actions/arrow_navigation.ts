/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ShortcutRegistry,
  utils as BlocklyUtils,
  Field,
  keyboardNavigationController,
} from 'blockly/core';

import type {Toolbox, WorkspaceSvg} from 'blockly/core';

import * as Blockly from 'blockly/core';
import * as Constants from '../constants';
import type {Navigation} from '../navigation';

const KeyCodes = BlocklyUtils.KeyCodes;

/**
 * Class for registering shortcuts for navigating the workspace with arrow keys.
 */
export class ArrowNavigation {
  constructor(private navigation: Navigation) {}

  /**
   * Gives the cursor to the field to handle if the cursor is on a field.
   *
   * @param workspace The workspace to check.
   * @param shortcut The shortcut
   *     to give to the field.
   * @returns True if the shortcut was handled by the field, false
   *     otherwise.
   */
  fieldShortcutHandler(
    workspace: WorkspaceSvg,
    shortcut: ShortcutRegistry.KeyboardShortcut,
  ): boolean {
    const curNode = workspace.getCursor().getCurNode();
    if (curNode instanceof Field) {
      return curNode.onShortcut(shortcut);
    }
    return false;
  }

  /**
   * Adds all arrow key navigation shortcuts to the registry.
   */
  install() {
    const navigateIn = (
      workspace: WorkspaceSvg,
      e: Event,
      shortcut: ShortcutRegistry.KeyboardShortcut,
    ): boolean => {
      const toolbox = workspace.getToolbox() as Toolbox;
      const flyout = workspace.isFlyout
        ? workspace.targetWorkspace?.getFlyout()
        : workspace.getFlyout();
      let isHandled = false;
      switch (this.navigation.getState()) {
        case Constants.STATE.WORKSPACE:
          isHandled = this.fieldShortcutHandler(workspace, shortcut);
          if (!isHandled && workspace) {
            if (
              !this.navigation.defaultWorkspaceCursorPositionIfNeeded(workspace)
            ) {
              workspace.getCursor().in();
            }
            isHandled = true;
          }
          return isHandled;
        case Constants.STATE.TOOLBOX:
          // @ts-expect-error private method
          isHandled = toolbox && toolbox.selectChild();
          if (!isHandled && flyout) {
            this.navigation.defaultFlyoutCursorIfNeeded(workspace);
          }
          return true;
        default:
          return false;
      }
    };

    const navigateOut = (
      workspace: WorkspaceSvg,
      e: Event,
      shortcut: ShortcutRegistry.KeyboardShortcut,
    ): boolean => {
      const toolbox = workspace.isFlyout
        ? workspace.targetWorkspace?.getToolbox()
        : workspace.getToolbox();
      let isHandled = false;
      switch (this.navigation.getState()) {
        case Constants.STATE.WORKSPACE:
          isHandled = this.fieldShortcutHandler(workspace, shortcut);
          if (!isHandled && workspace) {
            if (
              !this.navigation.defaultWorkspaceCursorPositionIfNeeded(workspace)
            ) {
              workspace.getCursor().out();
            }
            isHandled = true;
          }
          return isHandled;
        case Constants.STATE.FLYOUT:
          if (toolbox) {
            Blockly.getFocusManager().focusTree(toolbox);
          }
          return true;
        case Constants.STATE.TOOLBOX:
          // @ts-expect-error private method
          return toolbox && toolbox.selectParent();
        default:
          return false;
      }
    };

    const shortcuts: {
      [name: string]: ShortcutRegistry.KeyboardShortcut;
    } = {
      /** Go to the next location to the right. */
      right: {
        name: Constants.SHORTCUT_NAMES.RIGHT,
        preconditionFn: (workspace) =>
          this.navigation.canCurrentlyNavigate(workspace),
        callback: (workspace, e, shortcut) => {
          keyboardNavigationController.setIsActive(true);
          return workspace.RTL
            ? navigateOut(workspace, e, shortcut)
            : navigateIn(workspace, e, shortcut);
        },
        keyCodes: [KeyCodes.RIGHT],
      },

      /** Go to the next location to the left. */
      left: {
        name: Constants.SHORTCUT_NAMES.LEFT,
        preconditionFn: (workspace) =>
          this.navigation.canCurrentlyNavigate(workspace),
        callback: (workspace, e, shortcut) => {
          keyboardNavigationController.setIsActive(true);
          return workspace.RTL
            ? navigateIn(workspace, e, shortcut)
            : navigateOut(workspace, e, shortcut);
        },
        keyCodes: [KeyCodes.LEFT],
      },

      /** Go down to the next location. */
      down: {
        name: Constants.SHORTCUT_NAMES.DOWN,
        preconditionFn: (workspace) =>
          this.navigation.canCurrentlyNavigate(workspace),
        callback: (workspace, e, shortcut) => {
          keyboardNavigationController.setIsActive(true);
          let isHandled = false;
          switch (this.navigation.getState()) {
            case Constants.STATE.WORKSPACE:
              isHandled = this.fieldShortcutHandler(workspace, shortcut);
              if (!isHandled && workspace) {
                if (
                  !this.navigation.defaultWorkspaceCursorPositionIfNeeded(
                    workspace,
                  )
                ) {
                  workspace.getCursor().next();
                }
                isHandled = true;
              }
              return isHandled;
            case Constants.STATE.FLYOUT:
              isHandled = this.fieldShortcutHandler(workspace, shortcut);
              if (!isHandled && workspace.targetWorkspace) {
                if (
                  !this.navigation.defaultFlyoutCursorIfNeeded(
                    workspace.targetWorkspace,
                  )
                ) {
                  workspace.getCursor().next();
                }
                isHandled = true;
              }
              return isHandled;
            case Constants.STATE.TOOLBOX: {
              const toolbox = workspace.getToolbox() as Toolbox;
              if (toolbox) {
                if (!toolbox.getSelectedItem()) {
                  const firstItem =
                    toolbox
                      .getToolboxItems()
                      .find((item) => item.isSelectable()) ?? null;
                  toolbox.setSelectedItem(firstItem);
                  isHandled = true;
                } else {
                  // @ts-expect-error private method
                  isHandled = toolbox.selectNext();
                }
                const selectedItem = toolbox.getSelectedItem();
                if (selectedItem) {
                  Blockly.getFocusManager().focusNode(selectedItem);
                }
              }
              return isHandled;
            }
            default:
              return false;
          }
        },
        keyCodes: [KeyCodes.DOWN],
      },
      /** Go up to the previous location. */
      up: {
        name: Constants.SHORTCUT_NAMES.UP,
        preconditionFn: (workspace) =>
          this.navigation.canCurrentlyNavigate(workspace),
        callback: (workspace, e, shortcut) => {
          keyboardNavigationController.setIsActive(true);
          let isHandled = false;
          switch (this.navigation.getState()) {
            case Constants.STATE.WORKSPACE:
              isHandled = this.fieldShortcutHandler(workspace, shortcut);
              if (!isHandled) {
                if (
                  !this.navigation.defaultWorkspaceCursorPositionIfNeeded(
                    workspace,
                    'last',
                  )
                ) {
                  workspace.getCursor().prev();
                }
                isHandled = true;
              }
              return isHandled;
            case Constants.STATE.FLYOUT:
              isHandled = this.fieldShortcutHandler(workspace, shortcut);
              if (!isHandled && workspace.targetWorkspace) {
                if (
                  !this.navigation.defaultFlyoutCursorIfNeeded(
                    workspace.targetWorkspace,
                    'last',
                  )
                ) {
                  workspace.getCursor().prev();
                }
                isHandled = true;
              }
              return isHandled;
            case Constants.STATE.TOOLBOX: {
              const toolbox = workspace.getToolbox() as Toolbox;
              if (toolbox) {
                // @ts-expect-error private method
                isHandled = toolbox.selectPrevious();
                const selectedItem = toolbox.getSelectedItem();
                if (selectedItem) {
                  Blockly.getFocusManager().focusNode(selectedItem);
                }
              }
              return isHandled;
            }
            default:
              return false;
          }
        },
        keyCodes: [KeyCodes.UP],
      },
    };

    for (const shortcut of Object.values(shortcuts)) {
      ShortcutRegistry.registry.register(shortcut);
    }
  }

  /**
   * Removes all the arrow navigation shortcuts.
   */
  uninstall() {
    ShortcutRegistry.registry.unregister(Constants.SHORTCUT_NAMES.LEFT);
    ShortcutRegistry.registry.unregister(Constants.SHORTCUT_NAMES.RIGHT);
    ShortcutRegistry.registry.unregister(Constants.SHORTCUT_NAMES.DOWN);
    ShortcutRegistry.registry.unregister(Constants.SHORTCUT_NAMES.UP);
  }
}
