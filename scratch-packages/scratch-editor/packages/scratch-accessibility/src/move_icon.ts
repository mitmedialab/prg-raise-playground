/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import {MoveIndicatorBubble} from './move_indicator';

/**
 * Invisible icon that acts as an anchor for a move indicator bubble.
 */
export class MoveIcon implements Blockly.IIcon, Blockly.IHasBubble {
  private moveIndicator: MoveIndicatorBubble;
  static readonly type = new Blockly.icons.IconType('moveIndicator');

  /**
   * Creates a new MoveIcon instance.
   *
   * @param sourceBlock The block this icon is attached to.
   */
  constructor(private sourceBlock: Blockly.BlockSvg) {
    this.moveIndicator = new MoveIndicatorBubble(this.sourceBlock);
  }

  /**
   * Returns the type of this icon.
   */
  getType(): Blockly.icons.IconType<MoveIcon> {
    return MoveIcon.type;
  }

  /**
   * Returns the weight of this icon, which controls its position relative to
   * other icons.
   *
   * @returns The weight of this icon.
   */
  getWeight(): number {
    return -1;
  }

  /**
   * Returns the size of this icon.
   *
   * @returns A rect with negative width and no height to offset the default
   *     padding applied to icons.
   */
  getSize(): Blockly.utils.Size {
    // Awful hack to cancel out the default padding added to icons.
    return new Blockly.utils.Size(-8, 0);
  }

  /**
   * Returns whether this icon is visible when its parent block is collapsed.
   *
   * @returns False since this icon is never visible.
   */
  isShownWhenCollapsed(): boolean {
    return false;
  }

  /**
   * Returns whether this icon can be clicked in the flyout.
   *
   * @returns False since this icon is invisible and not clickable.
   */
  isClickableInFlyout(): boolean {
    return false;
  }

  /**
   * Returns whether this icon's attached bubble is visible.
   *
   * @returns True because this icon only exists to host its bubble.
   */
  bubbleIsVisible(): boolean {
    return true;
  }

  /**
   * Returns this icon's bubble.
   */
  getBubble(): Blockly.IBubble | null {
    return this.moveIndicator;
  }

  /**
   * Called when the location of this icon's block changes.
   *
   * @param blockOrigin The new location of this icon's block.
   */
  onLocationChange(blockOrigin: Blockly.utils.Coordinate) {
    this.moveIndicator?.updateLocation();
  }

  /**
   * Disposes of this icon.
   */
  dispose() {
    this.moveIndicator?.dispose();
  }

  // These methods are required by the interfaces, but intentionally have no
  // implementation, largely because this icon has no visual representation.
  applyColour() {}

  hideForInsertionMarker() {}

  updateEditable() {}

  updateCollapsed() {}

  setOffsetInBlock() {}

  onClick() {}

  async setBubbleVisible(visible: boolean) {}

  initView(pointerDownListener: (e: PointerEvent) => void) {}

  /** See IFocusableNode.getFocusableElement. */
  getFocusableElement(): HTMLElement | SVGElement {
    throw new Error('This node is not focusable.');
  }

  /** See IFocusableNode.getFocusableTree. */
  getFocusableTree(): Blockly.IFocusableTree {
    throw new Error('This node is not focusable.');
  }

  /** See IFocusableNode.onNodeFocus. */
  onNodeFocus(): void {}

  /** See IFocusableNode.onNodeBlur. */
  onNodeBlur(): void {}

  /** See IFocusableNode.canBeFocused. */
  canBeFocused(): boolean {
    return false;
  }
}
