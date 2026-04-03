/**
 * Centralises hints that we show.
 *
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Msg, WorkspaceSvg, Toast} from 'blockly';
import {SHORTCUT_NAMES} from './constants';
import {getShortActionShortcut} from './shortcut_formatting';

const unconstrainedMoveHintId = 'unconstrainedMoveHint';
const constrainedMoveHintId = 'constrainedMoveHint';
const copiedHintId = 'copiedHint';
const cutHintId = 'cutHint';
const helpHintId = 'helpHint';

/**
 * Nudge the user to use unconstrained movement.
 *
 * @param workspace Workspace.
 * @param force Set to show it even if previously shown.
 */
export function showUnconstrainedMoveHint(
  workspace: WorkspaceSvg,
  force = false,
) {
  const enter = getShortActionShortcut(SHORTCUT_NAMES.EDIT_OR_CONFIRM);
  const modifier = navigator.platform.startsWith('Mac') ? '⌥' : 'Ctrl';
  const message = `Hold ${modifier} and use arrow keys to move freely, then ${enter} to accept the position`;
  Toast.show(workspace, {
    message,
    id: unconstrainedMoveHintId,
    oncePerSession: !force,
  });
}

/**
 * Nudge the user to move a block that's in move mode.
 *
 * @param workspace Workspace.
 */
export function showConstrainedMovementHint(workspace: WorkspaceSvg) {
  const enter = getShortActionShortcut(SHORTCUT_NAMES.EDIT_OR_CONFIRM);
  const message = `Use the arrow keys to move, then ${enter} to accept the position`;
  Toast.show(workspace, {
    message,
    id: constrainedMoveHintId,
    oncePerSession: true,
  });
}

/**
 * Clear active move-related hints, if any.
 *
 * @param workspace The workspace.
 */
export function clearMoveHints(workspace: WorkspaceSvg) {
  Toast.hide(workspace, constrainedMoveHintId);
  Toast.hide(workspace, unconstrainedMoveHintId);
}

/**
 * Nudge the user to paste after a copy.
 *
 * @param workspace Workspace.
 */
export function showCopiedHint(workspace: WorkspaceSvg) {
  Toast.show(workspace, {
    message: `Copied. Press ${getShortActionShortcut(SHORTCUT_NAMES.PASTE)} to paste.`,
    duration: 7,
    id: copiedHintId,
  });
}

/**
 * Nudge the user to paste after a cut.
 *
 * @param workspace Workspace.
 */
export function showCutHint(workspace: WorkspaceSvg) {
  Toast.show(workspace, {
    message: `Cut. Press ${getShortActionShortcut(SHORTCUT_NAMES.PASTE)} to paste.`,
    duration: 7,
    id: cutHintId,
  });
}

/**
 * Clear active paste-related hints, if any.
 *
 * @param workspace The workspace.
 */
export function clearPasteHints(workspace: WorkspaceSvg) {
  Toast.hide(workspace, cutHintId);
  Toast.hide(workspace, copiedHintId);
}

/**
 * Nudge the user to open the help.
 *
 * @param workspace The workspace.
 */
export function showHelpHint(workspace: WorkspaceSvg) {
  const shortcut = getShortActionShortcut('list_shortcuts');
  const message = Msg['HELP_PROMPT'].replace('%1', shortcut);
  const id = helpHintId;
  Toast.show(workspace, {message, id});
}

/**
 * Clear the help hint.
 *
 * @param workspace The workspace.
 */
export function clearHelpHint(workspace: WorkspaceSvg) {
  // TODO: We'd like to do this in MakeCode too as we override.
  // Could have an option for showing help in the plugin?
  Toast.hide(workspace, helpHintId);
}
