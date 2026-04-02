/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ShortcutRegistry,
  utils as BlocklyUtils,
  getFocusManager,
  Gesture,
  icons,
} from 'blockly/core';

import * as Constants from '../constants';
import type {Navigation} from '../navigation';

const KeyCodes = BlocklyUtils.KeyCodes;

/**
 * Class for registering a shortcut for the exit action.
 */
export class ExitAction {
  constructor(private navigation: Navigation) {}

  /**
   * Adds the exit action shortcut to the registry.
   */
  install() {
    ShortcutRegistry.registry.register({
      name: Constants.SHORTCUT_NAMES.EXIT,
      preconditionFn: (workspace) =>
        this.navigation.canCurrentlyNavigate(workspace),
      callback: (workspace) => {
        switch (this.navigation.getState()) {
          case Constants.STATE.FLYOUT:
          case Constants.STATE.TOOLBOX:
            getFocusManager().focusTree(workspace.targetWorkspace ?? workspace);
            if (!Gesture.inProgress()) {
              workspace.hideChaff();
            }
            return true;
          case Constants.STATE.WORKSPACE: {
            if (workspace.isMutator) {
              const parent = workspace.options.parentWorkspace
                ?.getAllBlocks()
                .map((block) => block.getIcons())
                .flat()
                .find(
                  (icon): icon is icons.MutatorIcon =>
                    icon instanceof icons.MutatorIcon &&
                    icon.bubbleIsVisible() &&
                    icon.getBubble()?.getWorkspace() === workspace,
                );
              if (parent) {
                parent.setBubbleVisible(false);
                getFocusManager().focusNode(parent);
                return true;
              }
            }
            return false;
          }
          default:
            return false;
        }
      },
      keyCodes: [KeyCodes.ESC],
      allowCollision: true,
    });
  }

  /**
   * Removes the exit action shortcut.
   */
  uninstall() {
    ShortcutRegistry.registry.unregister(Constants.SHORTCUT_NAMES.EXIT);
  }
}
