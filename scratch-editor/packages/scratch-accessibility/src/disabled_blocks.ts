/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

const lastBlockDisabledReasons: Map<string, Set<string>> = new Map();

/**
 * A change listener that enables disabled blocks when they
 * are dragged, and re-disables them at the end of the drag.
 *
 * @param event Blockly event
 */
export function enableBlocksOnDrag(event: Blockly.Events.Abstract) {
  // This listener only runs on Drag events that have a valid
  // workspace and block id.
  if (!isBlockDrag(event)) return;
  if (!event.blockId) return;
  const eventWorkspace = Blockly.common.getWorkspaceById(
    event.workspaceId,
  ) as Blockly.WorkspaceSvg;
  const block = eventWorkspace.getBlockById(event.blockId);
  if (!block) return;

  const oldUndo = Blockly.Events.getRecordUndo();
  Blockly.Events.setRecordUndo(false);

  if (event.isStart) {
    // At start of drag, reset the lastBlockDisabledReasons
    lastBlockDisabledReasons.clear();

    // Enable all blocks including childeren
    enableAllDraggedBlocks(block);
  } else {
    // Re-disable the block for its original reasons. If the block is no
    // longer an orphan, the disableOrphans handler will enable the block.
    redisableAllDraggedBlocks(block);
  }

  Blockly.Events.setRecordUndo(oldUndo);
}

/**
 * Enables all blocks including children of the dragged blocks.
 * Stores the reasons each block was disabled so they can be restored.
 *
 * @param block
 */
function enableAllDraggedBlocks(block: Blockly.BlockSvg) {
  // getDescendants includes the block itself.
  block.getDescendants(false).forEach((descendant) => {
    const reasons = new Set(descendant.getDisabledReasons());
    lastBlockDisabledReasons.set(descendant.id, reasons);
    reasons.forEach((reason) => descendant.setDisabledReason(false, reason));
  });
}

/**
 * Re-disables all blocks using their original disabled reasons.
 *
 * @param block
 */
function redisableAllDraggedBlocks(block: Blockly.BlockSvg) {
  block.getDescendants(false).forEach((descendant) => {
    lastBlockDisabledReasons.get(descendant.id)?.forEach((reason) => {
      descendant.setDisabledReason(true, reason);
    });
  });
}

/**
 * Type guard for drag events.
 *
 * @param event
 * @returns true iff event.type is EventType.BLOCK_DRAG
 */
function isBlockDrag(
  event: Blockly.Events.Abstract,
): event is Blockly.Events.BlockDrag {
  return event.type === Blockly.Events.BLOCK_DRAG;
}
