/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ContextMenuRegistry,
  Msg,
  ShortcutRegistry,
  utils,
  WorkspaceSvg,
  keyboardNavigationController,
  getFocusManager,
  comments,
  type IDraggable,
  type IFocusableNode,
  type IBoundedElement,
  type ISelectable,
} from 'blockly';
import {Direction} from '../drag_direction';
import {Mover, MoveType} from './mover';
import {getMenuItem} from '../shortcut_formatting';

const KeyCodes = utils.KeyCodes;
const createSerializedKey = ShortcutRegistry.registry.createSerializedKey.bind(
  ShortcutRegistry.registry,
);

/**
 * Actions for moving workspace elements with keyboard shortcuts.
 */
export class MoveActions {
  constructor(private mover: Mover) {}

  private shortcuts: ShortcutRegistry.KeyboardShortcut[] = [
    // Begin and end move.
    {
      name: 'start_move',
      preconditionFn: (workspace) => {
        const startDraggable = this.getCurrentDraggable(workspace);
        return (
          !!startDraggable && this.mover.canMove(workspace, startDraggable)
        );
      },
      callback: (workspace) => {
        keyboardNavigationController.setIsActive(true);
        const startDraggable = this.getCurrentDraggable(workspace);
        // Focus the root draggable in case one of its children
        // was focused when the move was triggered.
        if (startDraggable) {
          getFocusManager().focusNode(startDraggable);
        }
        return (
          !!startDraggable &&
          this.mover.startMove(workspace, startDraggable, MoveType.Move, null)
        );
      },
      keyCodes: [KeyCodes.M],
    },
    {
      name: 'finish_move',
      preconditionFn: (workspace) => this.mover.isMoving(workspace),
      callback: (workspace) => this.mover.finishMove(workspace),
      keyCodes: [KeyCodes.ENTER, KeyCodes.SPACE],
      allowCollision: true,
    },
    {
      name: 'abort_move',
      preconditionFn: (workspace) => this.mover.isMoving(workspace),
      callback: (workspace) => this.mover.abortMove(workspace),
      keyCodes: [KeyCodes.ESC],
      allowCollision: true,
    },

    // Constrained moves.
    {
      name: 'move_left_constrained',
      preconditionFn: (workspace) => this.mover.isMoving(workspace),
      callback: (workspace) =>
        this.mover.moveConstrained(workspace, Direction.Left),
      keyCodes: [KeyCodes.LEFT],
      allowCollision: true,
    },
    {
      name: 'move_right_constrained',
      preconditionFn: (workspace) => this.mover.isMoving(workspace),
      callback: (workspace) =>
        this.mover.moveConstrained(workspace, Direction.Right),
      keyCodes: [KeyCodes.RIGHT],
      allowCollision: true,
    },
    {
      name: 'move_up_constrained',
      preconditionFn: (workspace) => this.mover.isMoving(workspace),
      callback: (workspace) =>
        this.mover.moveConstrained(workspace, Direction.Up),
      keyCodes: [KeyCodes.UP],
      allowCollision: true,
    },
    {
      name: 'move_down_constrained',
      preconditionFn: (workspace) => this.mover.isMoving(workspace),
      callback: (workspace) =>
        this.mover.moveConstrained(workspace, Direction.Down),
      keyCodes: [KeyCodes.DOWN],
      allowCollision: true,
    },

    // Unconstrained moves.
    {
      name: 'move_left_unconstrained',
      preconditionFn: (workspace) => this.mover.isMoving(workspace),
      callback: (workspace) =>
        this.mover.moveUnconstrained(workspace, Direction.Left),
      keyCodes: [
        createSerializedKey(KeyCodes.LEFT, [KeyCodes.ALT]),
        createSerializedKey(KeyCodes.LEFT, [KeyCodes.CTRL]),
      ],
    },
    {
      name: 'move_right_unconstrained',
      preconditionFn: (workspace) => this.mover.isMoving(workspace),
      callback: (workspace) =>
        this.mover.moveUnconstrained(workspace, Direction.Right),
      keyCodes: [
        createSerializedKey(KeyCodes.RIGHT, [KeyCodes.ALT]),
        createSerializedKey(KeyCodes.RIGHT, [KeyCodes.CTRL]),
      ],
    },
    {
      name: 'move_up_unconstrained',
      preconditionFn: (workspace) => this.mover.isMoving(workspace),
      callback: (workspace) =>
        this.mover.moveUnconstrained(workspace, Direction.Up),
      keyCodes: [
        createSerializedKey(KeyCodes.UP, [KeyCodes.ALT]),
        createSerializedKey(KeyCodes.UP, [KeyCodes.CTRL]),
      ],
    },
    {
      name: 'move_down_unconstrained',
      preconditionFn: (workspace) => this.mover.isMoving(workspace),
      callback: (workspace) =>
        this.mover.moveUnconstrained(workspace, Direction.Down),
      keyCodes: [
        createSerializedKey(KeyCodes.DOWN, [KeyCodes.ALT]),
        createSerializedKey(KeyCodes.DOWN, [KeyCodes.CTRL]),
      ],
    },
  ];

  private menuItems: ContextMenuRegistry.RegistryItem[] = [
    {
      displayText: () => getMenuItem(Msg['MOVE_BLOCK'], 'start_move'),
      preconditionFn: (scope, menuOpenEvent) => {
        const workspace = scope.block?.workspace as WorkspaceSvg | null;
        if (!workspace || menuOpenEvent instanceof PointerEvent)
          return 'hidden';

        const startDraggable = this.getCurrentDraggable(workspace);
        return !!startDraggable && this.mover.canMove(workspace, startDraggable)
          ? 'enabled'
          : 'disabled';
      },
      callback: (scope) => {
        const workspace = scope.block?.workspace as WorkspaceSvg | null;
        if (!workspace) return false;
        const startDraggable = this.getCurrentDraggable(workspace);
        // Focus the start block in case one of its fields or a shadow block
        // was focused when the move was triggered.
        if (startDraggable) {
          getFocusManager().focusNode(startDraggable);
        }
        return (
          !!startDraggable &&
          this.mover.startMove(workspace, startDraggable, MoveType.Move, null)
        );
      },
      scopeType: ContextMenuRegistry.ScopeType.BLOCK,
      id: 'move',
      weight: 8.5,
    },
    {
      displayText: () =>
        getMenuItem(Msg['MOVE_COMMENT'] ?? 'Move Comment', 'start_move'),
      preconditionFn: (scope, menuOpenEvent) => {
        const comment = scope.comment;
        if (!comment) return 'hidden';

        return this.mover.canMove(comment.workspace, comment)
          ? 'enabled'
          : 'disabled';
      },
      callback: (scope) => {
        const comment = scope.comment;
        if (!comment) return false;
        this.mover.startMove(comment.workspace, comment, MoveType.Move, null);
      },
      scopeType: ContextMenuRegistry.ScopeType.COMMENT,
      id: 'move_comment',
      weight: 8.5,
    },
  ];

  private registerShortcuts() {
    for (const shortcut of this.shortcuts) {
      ShortcutRegistry.registry.register(shortcut);
    }
  }

  private registerMenuItems() {
    for (const menuItem of this.menuItems) {
      ContextMenuRegistry.registry.register(menuItem);
    }
  }

  /**
   * Install the actions as both keyboard shortcuts and (where
   * applicable) context menu items.
   */
  install() {
    this.registerShortcuts();
    this.registerMenuItems();
  }

  /**
   * Uninstall these actions.
   */
  uninstall() {
    for (const shortcut of this.shortcuts) {
      ShortcutRegistry.registry.unregister(shortcut.name);
    }
    for (const menuItem of this.menuItems) {
      ContextMenuRegistry.registry.unregister(menuItem.id);
    }
  }

  /**
   * Get the source draggable for the cursor location, or undefined if no
   * source draggable can be found.
   * If the cursor is on a shadow block, walks up the tree until it finds
   * a non-shadow block to drag.
   *
   * @param workspace The workspace to inspect for a cursor.
   * @returns The source draggable, or undefined if no appropriate draggable
   *     could be found.
   */
  getCurrentDraggable(
    workspace: WorkspaceSvg,
  ): (IDraggable & IFocusableNode & IBoundedElement & ISelectable) | undefined {
    const node = getFocusManager().getFocusedNode();
    if (node instanceof comments.RenderedWorkspaceComment) return node;

    let block = workspace.getCursor().getSourceBlock();
    if (!block) return undefined;
    while (block.isShadow()) {
      block = block.getParent();
      if (!block) {
        throw new Error(
          'Tried to drag a shadow block with no parent. ' +
            'Shadow blocks should always have parents.',
        );
      }
    }
    return block;
  }
}
