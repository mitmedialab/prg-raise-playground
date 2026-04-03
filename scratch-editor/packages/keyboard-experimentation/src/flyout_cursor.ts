/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The class representing a cursor used to navigate the flyout.
 * @author aschmiedt@google.com (Abby Schmiedt)
 */

import * as Blockly from 'blockly/core';
import {scrollBoundsIntoView} from './workspace_utilities';

/**
 * Class for a flyout cursor.
 * This controls how a user navigates blocks in the flyout.
 * This cursor only allows a user to go to the previous or next stack.
 */
export class FlyoutCursor extends Blockly.LineCursor {
  /**
   * The constructor for the FlyoutCursor.
   *
   * @param flyout The flyout this cursor is for.
   */
  constructor(private readonly flyout: Blockly.IFlyout) {
    super(flyout.getWorkspace());
  }

  /**
   * Moves the cursor to the next stack of blocks in the flyout.
   *
   * @returns The next element, or null if the current node is
   *     not set or there is no next value.
   */
  override next(): Blockly.IFocusableNode | null {
    const curNode = this.getCurNode();
    if (!curNode) {
      return null;
    }
    const newNode = this.workspace.getNavigator().getNextSibling(curNode);

    if (newNode) {
      this.setCurNode(newNode);
    }
    return newNode;
  }

  /**
   * Moves the cursor to the previous stack of blocks in the flyout.
   *
   * @returns The previous element, or null if the current
   *     node is not set or there is no previous value.
   */
  override prev(): Blockly.IFocusableNode | null {
    const curNode = this.getCurNode();
    if (!curNode) {
      return null;
    }
    const newNode = this.workspace.getNavigator().getPreviousSibling(curNode);

    if (newNode) {
      this.setCurNode(newNode);
    }
    return newNode;
  }

  override setCurNode(node: Blockly.IFocusableNode) {
    super.setCurNode(node);

    let bounds: Blockly.utils.Rect | undefined;
    if (
      node &&
      'getBoundingRectangle' in node &&
      typeof node.getBoundingRectangle === 'function'
    ) {
      bounds = node.getBoundingRectangle();
    } else if (node instanceof Blockly.FlyoutButton) {
      const {x, y} = node.getPosition();
      bounds = new Blockly.utils.Rect(y, y + node.height, x, x + node.width);
    }

    if (!(bounds instanceof Blockly.utils.Rect)) return;

    scrollBoundsIntoView(bounds, this.flyout.getWorkspace());
  }
}

export const registrationType = Blockly.registry.Type.CURSOR;
export const registrationName = 'FlyoutCursor';

export const pluginInfo = {
  [registrationType.toString()]: registrationName,
};

/**
 * Registers the FlyoutCursor with Blockly's registry.
 */
export function registerFlyoutCursor() {
  Blockly.registry.register(
    registrationType,
    registrationName,
    FlyoutCursor,
    true,
  );
}
