/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Events,
  ShortcutRegistry,
  utils as BlocklyUtils,
  BlockSvg,
  FlyoutButton,
  RenderedConnection,
  WorkspaceSvg,
  Field,
  icons,
  FocusableTreeTraverser,
  renderManagement,
  comments,
  getFocusManager,
  hasBubble,
} from 'blockly/core';

import type {Block} from 'blockly/core';

import * as Constants from '../constants';
import type {Navigation} from '../navigation';
import {Mover, MoveType} from './mover';
import {
  showConstrainedMovementHint,
  showHelpHint,
  showUnconstrainedMoveHint,
} from '../hints';

const KeyCodes = BlocklyUtils.KeyCodes;

/**
 * Class for registering a shortcut for the enter action.
 */
export class EnterAction {
  constructor(
    private mover: Mover,
    private navigation: Navigation,
  ) {}

  /**
   * Adds the enter action shortcut to the registry.
   */
  install() {
    /**
     * Enter key:
     *
     * - On the flyout: press a button or choose a block to place.
     * - On a stack: open a block's context menu or field's editor.
     * - On the workspace: open the context menu.
     */
    ShortcutRegistry.registry.register({
      name: Constants.SHORTCUT_NAMES.EDIT_OR_CONFIRM,
      preconditionFn: (workspace): boolean => {
        switch (this.navigation.getState()) {
          case Constants.STATE.WORKSPACE:
            return this.shouldHandleEnterForWS(workspace);
          case Constants.STATE.FLYOUT: {
            // If we're in the flyout the only supported actions are inserting
            // blocks or clicking buttons, so don't handle this if the
            // main workspace is read only.
            const targetWorkspace = workspace.isFlyout
              ? workspace.targetWorkspace
              : workspace;
            if (!targetWorkspace) return false;
            return this.navigation.canCurrentlyEdit(targetWorkspace);
          }
          default:
            return false;
        }
      },
      callback: (workspace, event): boolean => {
        event.preventDefault();

        const targetWorkspace = workspace.isFlyout
          ? workspace.targetWorkspace
          : workspace;
        if (!targetWorkspace) return false;

        let flyoutCursor;
        let curNode;

        switch (this.navigation.getState()) {
          case Constants.STATE.WORKSPACE:
            return this.handleEnterForWS(workspace);
          case Constants.STATE.FLYOUT:
            flyoutCursor = this.navigation.getFlyoutCursor(targetWorkspace);
            if (!flyoutCursor) {
              return false;
            }
            curNode = flyoutCursor.getCurNode();
            if (curNode instanceof BlockSvg) {
              this.insertFromFlyout(targetWorkspace);
            } else if (curNode instanceof FlyoutButton) {
              this.triggerButtonCallback(targetWorkspace);
            }
            return true;
          default:
            return false;
        }
      },
      keyCodes: [KeyCodes.ENTER, KeyCodes.SPACE],
      allowCollision: true,
    });
  }

  /**
   * Checks if the enter key should do anything for this ws.
   *
   * @param workspace The workspace to check.
   * @returns True if the enter action should be handled.
   */
  private shouldHandleEnterForWS(workspace: WorkspaceSvg): boolean {
    if (!this.navigation.canCurrentlyNavigate(workspace)) return false;
    if (workspace.isDragging()) return false;

    const curNode = workspace.getCursor().getCurNode();
    if (!curNode) return false;
    if (curNode instanceof Field) return curNode.isClickable();
    if (
      curNode instanceof RenderedConnection ||
      curNode instanceof WorkspaceSvg
    ) {
      return !workspace.isReadOnly();
    }
    // Returning true is sometimes incorrect for icons, but there's no API to check.
    return (
      curNode instanceof BlockSvg ||
      curNode instanceof icons.Icon ||
      curNode instanceof comments.CommentBarButton ||
      curNode instanceof comments.RenderedWorkspaceComment
    );
  }

  /**
   * Handles hitting the enter key on the workspace.
   *
   * @param workspace The workspace.
   * @returns True if the enter was handled, false otherwise.
   */
  private handleEnterForWS(workspace: WorkspaceSvg): boolean {
    const cursor = workspace.getCursor();
    const curNode = cursor.getCurNode();
    if (!curNode) return false;
    if (curNode instanceof Field) {
      curNode.showEditor();
      return true;
    } else if (curNode instanceof BlockSvg) {
      if (!this.tryShowFullBlockFieldEditor(curNode)) {
        showHelpHint(workspace);
      }
      return true;
    } else if (
      curNode instanceof RenderedConnection ||
      curNode instanceof WorkspaceSvg
    ) {
      this.navigation.openToolboxOrFlyout(workspace);
      return true;
    } else if (curNode instanceof icons.Icon) {
      // Calling the icon's click handler will trigger its action, generally
      // opening a bubble of some sort. We then need to wait for the bubble to
      // appear before attempting to navigate into it.
      curNode.onClick();
      renderManagement.finishQueuedRenders().then(() => {
        if (hasBubble(curNode) && curNode.bubbleIsVisible()) {
          cursor.in();
        }
      });
      return true;
    } else if (curNode instanceof comments.CommentBarButton) {
      curNode.performAction();
      return true;
    } else if (curNode instanceof comments.RenderedWorkspaceComment) {
      curNode.setCollapsed(false);
      getFocusManager().focusNode(curNode.getEditorFocusableNode());
      return true;
    }
    return false;
  }

  /**
   * Inserts a block from the flyout.
   * Tries to find a connection on the block to connect to the marked
   * location. If no connection has been marked, or there is not a compatible
   * connection then the block is placed on the workspace.
   * Trigger a toast per session if possible.
   *
   * @param workspace The main workspace. The workspace
   *     the block will be placed on.
   */
  private insertFromFlyout(workspace: WorkspaceSvg) {
    workspace.setResizesEnabled(false);
    // Create a new event group or append to the existing group.
    const existingGroup = Events.getGroup();
    if (!existingGroup) {
      Events.setGroup(true);
    }

    // If the workspace has never had focus default the stationary node.
    const stationaryNode =
      FocusableTreeTraverser.findFocusedNode(workspace) ??
      workspace.getRestoredFocusableNode(null);
    const newBlock = this.createNewBlock(workspace);
    if (!newBlock) return;
    const insertStartPoint = stationaryNode
      ? this.navigation.findInsertStartPoint(stationaryNode, newBlock)
      : null;

    if (workspace.getTopBlocks().includes(newBlock)) {
      this.positionNewTopLevelBlock(workspace, newBlock);
    }

    workspace.setResizesEnabled(true);

    this.mover.startMove(
      workspace,
      newBlock,
      MoveType.Insert,
      insertStartPoint,
    );

    const isStartBlock =
      !newBlock.outputConnection &&
      !newBlock.nextConnection &&
      !newBlock.previousConnection;
    if (isStartBlock) {
      showUnconstrainedMoveHint(workspace, false);
    } else {
      showConstrainedMovementHint(workspace);
    }
  }

  /**
   * Position a new top-level block to avoid overlap at the top left.
   *
   * Similar to `WorkspaceSvg.cleanUp()` but does not constrain itself to not
   * affecting code ordering in order to use horizontal space.
   *
   * @param workspace The workspace.
   * @param newBlock The top-level block to move to free space.
   */
  private positionNewTopLevelBlock(
    workspace: WorkspaceSvg,
    newBlock: BlockSvg,
  ) {
    const initialY = 10;
    const initialX = 10;
    const xSpacing = 80;

    const filteredTopBlocks = workspace
      .getTopBlocks(true)
      .filter((block) => block.id !== newBlock.id);
    const allBlockBounds = filteredTopBlocks.map((block) =>
      block.getBoundingRectangle(),
    );

    const toolboxWidth = workspace.getToolbox()?.getWidth();
    const workspaceWidth =
      workspace.getParentSvg().clientWidth - (toolboxWidth ?? 0);
    const workspaceHeight = workspace.getParentSvg().clientHeight;
    const {height: newBlockHeight, width: newBlockWidth} =
      newBlock.getHeightWidth();

    const getNextIntersectingBlock = function (
      newBlockRect: BlocklyUtils.Rect,
    ): BlocklyUtils.Rect | null {
      for (const rect of allBlockBounds) {
        if (newBlockRect.intersects(rect)) {
          return rect;
        }
      }
      return null;
    };

    let cursorY = initialY;
    let cursorX = initialX;
    const minBlockHeight = workspace
      .getRenderer()
      .getConstants().MIN_BLOCK_HEIGHT;
    // Make the initial movement of shifting the block to its best possible position.
    let boundingRect = newBlock.getBoundingRectangle();
    newBlock.moveBy(cursorX - boundingRect.left, cursorY - boundingRect.top, [
      'cleanup',
    ]);
    newBlock.snapToGrid();

    boundingRect = newBlock.getBoundingRectangle();
    let conflictingRect = getNextIntersectingBlock(boundingRect);
    while (conflictingRect != null) {
      const newCursorX =
        conflictingRect.left + conflictingRect.getWidth() + xSpacing;
      const newCursorY =
        conflictingRect.top + conflictingRect.getHeight() + minBlockHeight;
      if (newCursorX + newBlockWidth <= workspaceWidth) {
        cursorX = newCursorX;
      } else if (newCursorY + newBlockHeight <= workspaceHeight) {
        cursorY = newCursorY;
        cursorX = initialX;
      } else {
        // Off screen, but new blocks will be selected which will scroll them
        // into view.
        cursorY = newCursorY;
        cursorX = initialX;
      }
      newBlock.moveBy(cursorX - boundingRect.left, cursorY - boundingRect.top, [
        'cleanup',
      ]);
      newBlock.snapToGrid();
      boundingRect = newBlock.getBoundingRectangle();
      conflictingRect = getNextIntersectingBlock(boundingRect);
    }

    newBlock.bringToFront();
  }

  /**
   * Triggers a flyout button's callback.
   *
   * @param workspace The main workspace. The workspace
   *     containing a flyout with a button.
   */
  private triggerButtonCallback(workspace: WorkspaceSvg) {
    const button = this.navigation.getFlyoutCursor(workspace)?.getCurNode();
    if (!(button instanceof FlyoutButton)) return;

    const flyoutButtonCallbacks: Map<string, (p1: FlyoutButton) => void> =
      // @ts-expect-error private field access
      workspace.flyoutButtonCallbacks;

    // TODO: Remove cast once blockly 12.4.0 is the minimum version of Blockly required.
    // button.callbackKey is private until that version.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const callbackKey = (button as any).callbackKey;
    const buttonCallback = flyoutButtonCallbacks.get(callbackKey);
    if (!buttonCallback) {
      throw new Error('No callback function found for flyout button.');
    }
    buttonCallback(button);
  }

  /**
   * If this block has a full block field then show its editor.
   *
   * @param block A block.
   * @returns True if we showed the editor, false otherwise.
   */
  private tryShowFullBlockFieldEditor(block: Block): boolean {
    if (block.isSimpleReporter()) {
      for (const input of block.inputList) {
        for (const field of input.fieldRow) {
          if (field.isClickable() && field.isFullBlockField()) {
            field.showEditor();
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Creates a new block based on the current block the flyout cursor is on.
   *
   * @param workspace The main workspace. The workspace
   *     the block will be placed on.
   * @returns The newly created block.
   */
  private createNewBlock(workspace: WorkspaceSvg): BlockSvg | null {
    const flyout = workspace.getFlyout();
    if (!flyout || !flyout.isVisible()) {
      console.warn(
        'Trying to insert from the flyout when the flyout does not ' +
          ' exist or is not visible',
      );
      return null;
    }

    const curBlock = this.navigation.getFlyoutCursor(workspace)?.getCurNode();
    if (!(curBlock instanceof BlockSvg) || !curBlock.isEnabled()) {
      console.warn("Can't insert a disabled block.");
      return null;
    }

    const newBlock = flyout.createBlock(curBlock);
    // Render to get the sizing right.
    newBlock.render();
    // Connections are not tracked when the block is first created.  Normally
    // there's enough time for them to become tracked in the user's mouse
    // movements, but not here.
    newBlock.setConnectionTracking(true);
    return newBlock;
  }

  /**
   * Removes the enter action shortcut.
   */
  uninstall() {
    ShortcutRegistry.registry.unregister(
      Constants.SHORTCUT_NAMES.EDIT_OR_CONFIRM,
    );
  }
}
