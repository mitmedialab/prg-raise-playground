/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

/**
 * Bubble that displays a four-way arrow attached to a block to indicate that
 * it is in move mode.
 */
export class MoveIndicatorBubble
  implements Blockly.IBubble, Blockly.IRenderedElement
{
  /**
   * Root SVG element for this bubble.
   */
  svgRoot: SVGGElement;

  /**
   * The location of this bubble in workspace coordinates.
   */
  location = new Blockly.utils.Coordinate(0, 0);

  /**
   * Creates a new move indicator bubble.
   *
   * @param sourceBlock The block this bubble should be associated with.
   */
  /* eslint-disable @typescript-eslint/naming-convention */
  constructor(
    private sourceElement: Blockly.ISelectable & Blockly.IBoundedElement,
  ) {
    const workspace = sourceElement.workspace as Blockly.WorkspaceSvg;
    this.svgRoot = Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.G,
      {},
      workspace.getBubbleCanvas(),
    );
    this.svgRoot.classList.add('blocklyMoveIndicatorBubble');
    const rtl = workspace.RTL;
    Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.CIRCLE,
      {
        'fill': 'white',
        'fill-opacity': '0.8',
        'stroke': 'grey',
        'stroke-width': '1',
        'r': 20,
        'cx': 20 * (rtl ? -1 : 1),
        'cy': 20,
      },
      this.svgRoot,
    );
    Blockly.utils.dom.createSvgElement(
      Blockly.utils.Svg.PATH,
      {
        'fill': 'none',
        'stroke': 'black',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        'd': 'm18 9l3 3l-3 3m-3-3h6M6 9l-3 3l3 3m-3-3h6m0 6l3 3l3-3m-3-3v6m3-15l-3-3l-3 3m3-3v6',
        'transform': `translate(${(rtl ? -4 : 1) * 8} 8)`,
      },
      this.svgRoot,
    );

    this.updateLocation();
  }

  /**
   * Returns whether this bubble is movable by the user.
   *
   * @returns Always returns false.
   */
  isMovable(): boolean {
    return false;
  }

  /**
   * Returns the root SVG element for this bubble.
   *
   * @returns The root SVG element.
   */
  getSvgRoot(): SVGGElement {
    return this.svgRoot;
  }

  /**
   * Recalculates this bubble's location, keeping it adjacent to its block.
   */
  updateLocation() {
    const bounds =
      this.sourceElement instanceof Blockly.BlockSvg
        ? this.sourceElement.getBoundingRectangleWithoutChildren()
        : this.sourceElement.getBoundingRectangle();
    const x = this.sourceElement.workspace.RTL
      ? bounds.left + 20
      : bounds.right - 20;
    const y = bounds.top - 20;
    this.moveTo(x, y);
    (this.sourceElement.workspace as Blockly.WorkspaceSvg)
      .getLayerManager()
      ?.moveToDragLayer(this);
  }

  /**
   * Moves this bubble to the specified location.
   *
   * @param x The location on the X axis to move to.
   * @param y The location on the Y axis to move to.
   */
  moveTo(x: number, y: number) {
    this.location.x = x;
    this.location.y = y;
    this.svgRoot.setAttribute('transform', `translate(${x}, ${y})`);
  }

  /**
   * Returns this bubble's location in workspace coordinates.
   *
   * @returns The bubble's location.
   */
  getRelativeToSurfaceXY(): Blockly.utils.Coordinate {
    return this.location;
  }

  /**
   * Disposes of this move indicator bubble.
   */
  dispose() {
    Blockly.utils.dom.removeNode(this.svgRoot);
  }

  // These methods are required by the interfaces, but intentionally have no
  // implementation, largely because this bubble's location is fixed relative
  // to its block and is not draggable by the user.
  showContextMenu() {}

  setDragging(dragging: boolean) {}

  startDrag(event: PointerEvent) {}

  drag(newLocation: Blockly.utils.Coordinate, event: PointerEvent) {}

  moveDuringDrag(newLocation: Blockly.utils.Coordinate) {}

  endDrag() {}

  revertDrag() {}

  setDeleteStyle(enable: boolean) {}

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
