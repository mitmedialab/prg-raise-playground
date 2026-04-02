/* eslint-disable @typescript-eslint/naming-convention */
// The rules expect camel or pascal case enum members and record properties.

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Constants for keyboard navigation.
 * @author aschmiedt@google.com (Abby Schmiedt)
 */

import {Msg} from 'blockly/core';

/**
 * Keyboard navigation states.
 * The different parts of Blockly that the user navigates between.
 */
export enum STATE {
  NOWHERE = 'nowhere',
  WORKSPACE = 'workspace',
  FLYOUT = 'flyout',
  TOOLBOX = 'toolbox',
}

/**
 * Default keyboard navigation shortcut names.
 */
export enum SHORTCUT_NAMES {
  UP = 'up',
  DOWN = 'down',
  RIGHT = 'right',
  LEFT = 'left',
  NEXT_STACK = 'next_stack',
  PREVIOUS_STACK = 'previous_stack',
  // Unused.
  INSERT = 'insert',
  EDIT_OR_CONFIRM = 'edit_or_confirm',
  DISCONNECT = 'disconnect',
  TOOLBOX = 'toolbox',
  EXIT = 'exit',
  MENU = 'menu',
  COPY = 'keyboard_nav_copy',
  CUT = 'keyboard_nav_cut',
  PASTE = 'keyboard_nav_paste',
  DUPLICATE = 'duplicate',
  MOVE_WS_CURSOR_UP = 'workspace_up',
  MOVE_WS_CURSOR_DOWN = 'workspace_down',
  MOVE_WS_CURSOR_LEFT = 'workspace_left',
  MOVE_WS_CURSOR_RIGHT = 'workspace_right',
  CREATE_WS_CURSOR = 'to_workspace',
  LIST_SHORTCUTS = 'list_shortcuts',
  CLEAN_UP = 'clean_up_workspace',
  START_MOVE = 'start_move',
}

export const SHORTCUT_NAMES_TO_DISPLAY_TEXT: Record<string, string> = {
  'keyboard_nav_copy': Msg['Copy'] || 'Copy',
  'keyboard_nav_cut': Msg['Cut'] || 'Cut',
  'keyboard_nav_paste': Msg['Paste'] || 'Paste',
  'start_move': Msg['MOVE_BLOCK'] || 'Move',
};

/**
 * Types of possible messages passed into the loggingCallback in the Navigation
 * class.
 */
export enum LOGGING_MSG_TYPE {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
}

/**
 * Categories used to organised the shortcut dialog.
 * Shortcut name should match those obtained from the Blockly shortcut register.
 */
export const SHORTCUT_CATEGORIES: Record<
  string,
  // Also allow undo/redo. Document the non-keyboard-nav versions of others for
  // better text because temporarily the name in the table is derived from
  // these id-like names.
  Array<SHORTCUT_NAMES | 'undo' | 'redo' | 'delete'>
> = {};

SHORTCUT_CATEGORIES[Msg['SHORTCUTS_GENERAL']] = [
  SHORTCUT_NAMES.MENU,
  SHORTCUT_NAMES.EDIT_OR_CONFIRM,
  SHORTCUT_NAMES.EXIT,
  SHORTCUT_NAMES.TOOLBOX,
  SHORTCUT_NAMES.CLEAN_UP,
  SHORTCUT_NAMES.LIST_SHORTCUTS,
];

SHORTCUT_CATEGORIES[Msg['SHORTCUTS_EDITING']] = [
  'delete',
  SHORTCUT_NAMES.DISCONNECT,
  SHORTCUT_NAMES.START_MOVE,
  SHORTCUT_NAMES.CUT,
  SHORTCUT_NAMES.COPY,
  SHORTCUT_NAMES.PASTE,
  SHORTCUT_NAMES.DUPLICATE,
  'undo',
  'redo',
];

SHORTCUT_CATEGORIES[Msg['SHORTCUTS_CODE_NAVIGATION']] = [
  SHORTCUT_NAMES.UP,
  SHORTCUT_NAMES.DOWN,
  SHORTCUT_NAMES.RIGHT,
  SHORTCUT_NAMES.LEFT,
  SHORTCUT_NAMES.NEXT_STACK,
  SHORTCUT_NAMES.PREVIOUS_STACK,
  SHORTCUT_NAMES.CREATE_WS_CURSOR,
];
