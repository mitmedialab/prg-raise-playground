/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Holds all methods necessary to use Blockly through the
 * keyboard.
 * @author aschmiedt@google.com (Abby Schmiedt)
 */

import * as Blockly from 'blockly/core';
import * as Constants from './constants';
import {
  registrationName as cursorRegistrationName,
  registrationType as cursorRegistrationType,
} from './flyout_cursor';

/**
 * Class that holds all methods necessary for keyboard navigation to work.
 */
export class Navigation {
  /**
   * Wrapper for method that deals with workspace changes.
   * Used for removing change listener.
   */
  protected wsChangeWrapper: (e: Blockly.Events.Abstract) => void;

  /**
   * Wrapper for method that deals with flyout changes.
   * Used for removing change listener.
   */
  protected flyoutChangeWrapper: (e: Blockly.Events.Abstract) => void;

  /**
   * The list of registered workspaces.
   * Used when removing change listeners in dispose.
   */
  protected workspaces: Blockly.WorkspaceSvg[] = [];

  /**
   * Constructor for keyboard navigation.
   */
  constructor() {
    this.wsChangeWrapper = this.workspaceChangeListener.bind(this);
    this.flyoutChangeWrapper = this.flyoutChangeListener.bind(this);
  }

  /**
   * Adds all necessary change listeners and markers to a workspace for keyboard
   * navigation to work. This must be called for keyboard navigation to work
   * on a workspace.
   *
   * @param workspace The workspace to add keyboard navigation to.
   */
  addWorkspace(workspace: Blockly.WorkspaceSvg) {
    this.workspaces.push(workspace);
    const flyout = workspace.getFlyout();
    workspace.addChangeListener(this.wsChangeWrapper);

    if (flyout) {
      this.addFlyout(flyout);
    }
  }

  /**
   * Removes all keyboard navigation change listeners and markers.
   *
   * @param workspace The workspace to remove keyboard navigation from.
   */
  removeWorkspace(workspace: Blockly.WorkspaceSvg) {
    const workspaceIdx = this.workspaces.indexOf(workspace);
    const flyout = workspace.getFlyout();
    this.disableKeyboardAccessibility(workspace);

    if (workspaceIdx > -1) {
      this.workspaces.splice(workspaceIdx, 1);
    }
    workspace.removeChangeListener(this.wsChangeWrapper);

    if (flyout) {
      this.removeFlyout(flyout);
    }
  }

  /**
   * Gets the navigation state of the current workspace.
   *
   * Note that this assumes a workspace with passive focus (including for its
   * toolbox or flyout) has a state of NOWHERE.
   *
   * @returns The state of the given workspace.
   */
  getState(): Constants.STATE {
    const focusManager = Blockly.getFocusManager();
    if (focusManager.ephemeralFocusTaken()) {
      return Constants.STATE.NOWHERE;
    }

    const focusedTree = focusManager.getFocusedTree();
    if (focusedTree instanceof Blockly.WorkspaceSvg) {
      if (focusedTree.isFlyout) {
        return Constants.STATE.FLYOUT;
      } else {
        return Constants.STATE.WORKSPACE;
      }
    } else if (focusedTree instanceof Blockly.Toolbox) {
      return Constants.STATE.TOOLBOX;
    } else if (focusedTree instanceof Blockly.Flyout) {
      return Constants.STATE.FLYOUT;
    }
    // Either a non-Blockly element currently has DOM focus, or a different
    // workspace holds it.
    return Constants.STATE.NOWHERE;
  }

  /**
   * Adds all event listeners and cursors to the flyout that are needed for
   * keyboard navigation to work.
   *
   * @param flyout The flyout to add a cursor and change listeners to.
   */
  addFlyout(flyout: Blockly.IFlyout) {
    const flyoutWorkspace = flyout.getWorkspace();
    flyoutWorkspace.addChangeListener(this.flyoutChangeWrapper);
    const FlyoutCursorClass = Blockly.registry.getClass(
      cursorRegistrationType,
      cursorRegistrationName,
    );
    if (FlyoutCursorClass) {
      flyoutWorkspace
        .getMarkerManager()
        .setCursor(new FlyoutCursorClass(flyout));
    }
  }

  /**
   * Removes all change listeners from the flyout that are needed for
   * keyboard navigation to work.
   *
   * @param flyout The flyout to add a cursor and event listeners to.
   */
  removeFlyout(flyout: Blockly.IFlyout) {
    const flyoutWorkspace = flyout.getWorkspace();
    flyoutWorkspace.removeChangeListener(this.flyoutChangeWrapper);
  }

  /**
   * Updates the state of keyboard navigation and the position of the cursor
   * based on workspace events.
   *
   * @param e The Blockly event to process.
   */
  workspaceChangeListener(e: Blockly.Events.Abstract) {
    if (!e.workspaceId) {
      return;
    }
    const workspace = Blockly.Workspace.getById(
      e.workspaceId,
    ) as Blockly.WorkspaceSvg;
    if (!workspace || !workspace.keyboardAccessibilityMode) {
      return;
    }
    if (e.type === Blockly.Events.BLOCK_CHANGE) {
      if ((e as Blockly.Events.BlockChange).element === 'mutation') {
        this.handleBlockMutation(workspace, e as Blockly.Events.BlockChange);
      }
    }
  }

  /**
   * Updates the state of keyboard navigation and the position of the cursor
   * based on events emitted from the flyout's workspace.
   *
   * @param e The Blockly event to process.
   */
  flyoutChangeListener(e: Blockly.Events.Abstract) {
    if (!e.workspaceId) {
      return;
    }
    const flyoutWorkspace = Blockly.Workspace.getById(
      e.workspaceId,
    ) as Blockly.WorkspaceSvg | null;
    const mainWorkspace = flyoutWorkspace?.targetWorkspace;
    if (!mainWorkspace) {
      return;
    }
    const flyout = mainWorkspace.getFlyout();
    if (!flyout) {
      return;
    }

    // This is called for simple toolboxes and for toolboxes that have a flyout
    // that does not close. Autoclosing flyouts close before we need to focus
    // the cursor on the block that was clicked.
    if (
      mainWorkspace &&
      mainWorkspace.keyboardAccessibilityMode &&
      !flyout.autoClose
    ) {
      if (
        e.type === Blockly.Events.CLICK &&
        (e as Blockly.Events.Click).targetType === 'block'
      ) {
        const {blockId} = e as Blockly.Events.Click;
        if (blockId) {
          const block = flyoutWorkspace.getBlockById(blockId);
          if (block) {
            this.handleBlockClickInFlyout(mainWorkspace, block);
          }
        }
      } else if (e.type === Blockly.Events.SELECTED) {
        const {newElementId} = e as Blockly.Events.Selected;
        if (newElementId) {
          const block = flyoutWorkspace.getBlockById(newElementId);
          if (block) {
            this.handleBlockClickInFlyout(mainWorkspace, block);
          }
        }
      }
    } else if (
      e.type === Blockly.Events.BLOCK_CREATE &&
      this.getState() === Constants.STATE.FLYOUT
    ) {
      // When variables are created, that recreates the flyout contents, leaving the
      // cursor in an invalid state.
      this.defaultFlyoutCursorIfNeeded(mainWorkspace);
    }
  }

  private isFlyoutItemDisposed(
    node: Blockly.IFocusableNode,
    sourceBlock: Blockly.BlockSvg | null,
  ) {
    if (sourceBlock?.disposed) {
      return true;
    }
    if (node instanceof Blockly.FlyoutButton) {
      return node.getSvgRoot().parentNode === null;
    }
    return false;
  }

  /**
   * Moves the cursor to the block level when the block the cursor is on
   * mutates.
   *
   * @param workspace The workspace the cursor belongs
   *     to.
   * @param e The Blockly event to process.
   */
  handleBlockMutation(
    workspace: Blockly.WorkspaceSvg,
    e: Blockly.Events.BlockChange,
  ) {
    const mutatedBlockId = e.blockId;
    const cursor = workspace.getCursor();
    const block = cursor.getSourceBlock();
    if (block && block.id === mutatedBlockId) {
      cursor.setCurNode(block);
    }
  }

  /**
   * Handles when a user clicks on a block in the flyout by moving the cursor
   * to that stack of blocks and setting the state of navigation to the flyout.
   *
   * @param mainWorkspace The workspace the user clicked on.
   * @param block The block the user clicked on.
   */
  handleBlockClickInFlyout(
    mainWorkspace: Blockly.WorkspaceSvg,
    block: Blockly.BlockSvg,
  ) {
    if (!block) {
      return;
    }
    const curNodeBlock = block.isShadow() ? block : block.getParent();
    if (curNodeBlock) {
      this.getFlyoutCursor(mainWorkspace)?.setCurNode(curNodeBlock);
    }
    const flyout = mainWorkspace.getFlyout();
    if (flyout) {
      Blockly.getFocusManager().focusTree(flyout.getWorkspace());
    }
  }

  /**
   * Move the flyout cursor to the preferred end if unset (as it is initially despite
   * the types) or on a disposed item.
   *
   * @param workspace The workspace.
   * @param prefer The preferred default position.
   * @return true if the cursor location was defaulted.
   */
  defaultFlyoutCursorIfNeeded(
    workspace: Blockly.WorkspaceSvg,
    prefer: 'first' | 'last' = 'first',
  ) {
    const flyout = workspace.getFlyout();
    if (!flyout) return false;
    const flyoutCursor = this.getFlyoutCursor(workspace);
    if (!flyoutCursor) return false;

    const curNode = flyoutCursor.getCurNode();
    const sourceBlock = flyoutCursor.getSourceBlock();
    // If the current node is a child of the flyout, nothing needs to be done.
    if (
      curNode &&
      curNode !== flyout.getWorkspace() &&
      curNode.getFocusableTree() === flyout.getWorkspace() &&
      !this.isFlyoutItemDisposed(curNode, sourceBlock)
    ) {
      return false;
    }

    const flyoutContents = flyout.getContents();
    const defaultFlyoutItem =
      prefer === 'first'
        ? flyoutContents[0]
        : flyoutContents[flyoutContents.length - 1];
    if (!defaultFlyoutItem) return false;
    const defaultFlyoutItemElement = defaultFlyoutItem.getElement();
    flyoutCursor.setCurNode(defaultFlyoutItemElement);
    return true;
  }

  /**
   * Sets the cursor location when focusing the workspace.
   * Tries the following, in order, stopping after the first success:
   *  - Resume editing by returning the cursor to its previous location, if valid.
   *  - Move the cursor to the top connection point on on the first top block.
   *  - Move the cursor to the default location on the workspace.
   *
   * @param workspace The main Blockly workspace.
   * @param prefer The preferred default position.
   * @return true if the cursor location was defaulted.
   */
  defaultWorkspaceCursorPositionIfNeeded(
    workspace: Blockly.WorkspaceSvg,
    prefer: 'first' | 'last' = 'first',
  ) {
    const topBlocks = workspace.getTopBlocks(true);
    const cursor = workspace.getCursor();
    const disposed = cursor.getSourceBlock()?.disposed;
    if (cursor.getCurNode() && !disposed) {
      // Retain the cursor's previous position since it's set, but only if not
      // disposed (which can happen when blocks are reloaded).
      return false;
    }
    if (topBlocks.length > 0) {
      cursor.setCurNode(
        topBlocks[prefer === 'first' ? 0 : topBlocks.length - 1],
      );
    } else {
      cursor.setCurNode(workspace);
    }
    return true;
  }

  /**
   * Gets the cursor on the flyout's workspace.
   *
   * @param workspace The main workspace the flyout is on.
   * @returns The flyout's cursor or null if no flyout exists.
   */
  getFlyoutCursor(workspace: Blockly.WorkspaceSvg): Blockly.LineCursor | null {
    const flyout = workspace.getFlyout();
    const cursor = flyout ? flyout.getWorkspace().getCursor() : null;

    return cursor;
  }

  /**
   * Tries to intelligently connect the blocks or connections
   * represented by the given nodes, based on node types and locations.
   *
   * @param stationaryNode The first node to connect.
   * @param movingBlock The block we're moving.
   * @returns True if the key was handled; false if something went
   *     wrong.
   */
  findInsertStartPoint(
    stationaryNode: Blockly.IFocusableNode,
    movingBlock: Blockly.BlockSvg,
  ): Blockly.RenderedConnection | null {
    const movingHasOutput = !!movingBlock.outputConnection;

    if (stationaryNode instanceof Blockly.Field) {
      // Can't connect a block to a field, so try going up to the source block.
      const sourceBlock = stationaryNode.getSourceBlock() as Blockly.BlockSvg;
      if (!sourceBlock) return null;
      return this.findInsertStartPoint(sourceBlock, movingBlock);
    } else if (stationaryNode instanceof Blockly.RenderedConnection) {
      // Move to the block if we're trying to insert a statement block into
      // a value connection.
      if (
        !movingHasOutput &&
        stationaryNode.type === Blockly.ConnectionType.INPUT_VALUE
      ) {
        const sourceBlock = stationaryNode.getSourceBlock();
        if (!sourceBlock) return null;
        return this.findInsertStartPoint(sourceBlock, movingBlock);
      }

      // Connect the moving block to the stationary connection using
      // the most plausible connection on the moving block.
      return stationaryNode;
    } else if (stationaryNode instanceof Blockly.WorkspaceSvg) {
      return null;
    } else if (stationaryNode instanceof Blockly.BlockSvg) {
      // 1. Connect blocks to first compatible input
      const inputType = movingHasOutput
        ? Blockly.inputs.inputTypes.VALUE
        : Blockly.inputs.inputTypes.STATEMENT;
      const compatibleConnections = stationaryNode.inputList
        .filter((input) => input.type === inputType)
        .map((input) => input.connection);
      for (const connection of compatibleConnections) {
        let targetConnection: Blockly.Connection | null | undefined =
          connection;
        if (inputType === Blockly.inputs.inputTypes.STATEMENT) {
          while (targetConnection?.targetBlock()?.nextConnection) {
            targetConnection = targetConnection?.targetBlock()?.nextConnection;
          }
        }

        if (
          targetConnection &&
          movingBlock.workspace.connectionChecker.canConnect(
            movingHasOutput
              ? movingBlock.outputConnection
              : movingBlock.previousConnection,
            targetConnection,
            true,
            // Since we're connecting programmatically, we don't care how
            // close the blocks are when determining if they can be connected.
            Infinity,
          )
        ) {
          return targetConnection as Blockly.RenderedConnection;
        }
      }

      // 2. Connect statement blocks to next connection. Only return a next
      // connection to which the statement block can actually connect; some
      // may be ineligible because they are e.g. in the middle of an immovable
      // stack.
      if (stationaryNode.nextConnection && !movingHasOutput) {
        let nextConnection: Blockly.RenderedConnection | null =
          stationaryNode.nextConnection;
        while (nextConnection) {
          if (
            movingBlock.workspace.connectionChecker.canConnect(
              movingBlock.previousConnection,
              nextConnection,
              true,
              // Since we're connecting programmatically, we don't care how
              // close the blocks are when determining if they can be connected.
              Infinity,
            )
          ) {
            return nextConnection;
          }
          nextConnection =
            nextConnection.getSourceBlock().getNextBlock()?.nextConnection ??
            null;
        }
      }

      // 3. Output connection. This will wrap around or displace.
      if (stationaryNode.outputConnection) {
        // Try to wrap.
        const target = stationaryNode.outputConnection.targetConnection;
        if (movingHasOutput && target) {
          return this.findInsertStartPoint(target, movingBlock);
        } else if (!movingHasOutput) {
          // Move to parent if we're trying to insert a statement block.
          const parent = stationaryNode.getParent();
          if (!parent) return null;
          return this.findInsertStartPoint(parent, movingBlock);
        }
        return stationaryNode.outputConnection;
      }
    }
    this.warn(`Unexpected case in findInsertStartPoint ${stationaryNode}.`);
    return null;
  }

  /**
   * Tries to intelligently connect the blocks or connections
   * represented by the given nodes, based on node types and locations.
   *
   * @param stationaryNode The first node to connect.
   * @param movingBlock The block we're moving.
   * @returns True if the connection was successful, false otherwise.
   */
  tryToConnectBlock(
    stationaryNode: Blockly.IFocusableNode,
    movingBlock: Blockly.BlockSvg,
  ): boolean {
    const destConnection = this.findInsertStartPoint(
      stationaryNode,
      movingBlock,
    );
    if (!destConnection) return false;
    return this.insertBlock(movingBlock, destConnection);
  }

  /**
   * Disconnects the child block from its parent block. No-op if the two given
   * connections are unrelated.
   *
   * @param movingConnection The connection that is being moved.
   * @param destConnection The connection to be moved to.
   */
  disconnectChild(
    movingConnection: Blockly.RenderedConnection,
    destConnection: Blockly.RenderedConnection,
  ) {
    const movingBlock = movingConnection.getSourceBlock();
    const destBlock = destConnection.getSourceBlock();
    let inferiorConnection;

    if (movingBlock.getRootBlock() === destBlock.getRootBlock()) {
      if (movingBlock.getDescendants(false).includes(destBlock)) {
        inferiorConnection = this.getInferiorConnection(destConnection);
        if (inferiorConnection) {
          inferiorConnection.disconnect();
        }
      } else {
        inferiorConnection = this.getInferiorConnection(movingConnection);
        if (inferiorConnection) {
          inferiorConnection.disconnect();
        }
      }
    }
  }

  /**
   * Tries to connect the  given connections.
   *
   * If the given connections are not compatible try finding compatible
   * connections on the source blocks of the given connections.
   *
   * @param movingConnection The connection that is being moved.
   * @param destConnection The connection to be moved to.
   * @returns True if the two connections or their target connections
   *     were connected, false otherwise.
   */
  connect(
    movingConnection: Blockly.RenderedConnection | null,
    destConnection: Blockly.RenderedConnection | null,
  ): boolean {
    if (!movingConnection || !destConnection) {
      return false;
    }

    const movingInferior = this.getInferiorConnection(movingConnection);
    const destSuperior = this.getSuperiorConnection(destConnection);

    const movingSuperior = this.getSuperiorConnection(movingConnection);
    const destInferior = this.getInferiorConnection(destConnection);

    if (
      movingInferior &&
      destSuperior &&
      this.moveAndConnect(movingInferior, destSuperior)
    ) {
      return true;
      // Try swapping the inferior and superior connections on the blocks.
    } else if (
      movingSuperior &&
      destInferior &&
      this.moveAndConnect(movingSuperior, destInferior)
    ) {
      return true;
    } else if (this.moveAndConnect(movingConnection, destConnection)) {
      return true;
    } else {
      const checker = movingConnection.getConnectionChecker();
      const reason = checker.canConnectWithReason(
        movingConnection,
        destConnection,
        false,
      );
      this.warn(
        'Connection failed with error: ' +
          checker.getErrorMessage(reason, movingConnection, destConnection),
      );
      return false;
    }
  }

  /**
   * Finds the inferior connection on the source block if the given connection
   * is superior.
   *
   * @param connection The connection trying to be connected.
   * @returns The inferior connection or null if none exists.
   */
  getInferiorConnection(
    connection: Blockly.RenderedConnection | null,
  ): Blockly.RenderedConnection | null {
    if (!connection) {
      return null;
    }
    const block = connection.getSourceBlock() as Blockly.BlockSvg;
    if (!connection.isSuperior()) {
      return connection;
    } else if (block.previousConnection) {
      return block.previousConnection;
    } else if (block.outputConnection) {
      return block.outputConnection;
    } else {
      return null;
    }
  }

  /**
   * Finds a superior connection on the source block if the given connection is
   * inferior.
   *
   * @param connection The connection trying to be connected.
   * @returns The superior connection or null if none exists.
   */
  getSuperiorConnection(
    connection: Blockly.RenderedConnection | null,
  ): Blockly.RenderedConnection | null {
    if (!connection) {
      return null;
    }
    if (connection.isSuperior()) {
      return connection;
    } else if (connection.targetConnection) {
      return connection.targetConnection;
    }
    return null;
  }

  /**
   * Moves the moving connection to the target connection and connects them.
   *
   * @param movingConnection The connection that is being moved.
   * @param destConnection The connection to be moved to.
   * @returns True if the connections were connected, false otherwise.
   */
  moveAndConnect(
    movingConnection: Blockly.RenderedConnection | null,
    destConnection: Blockly.RenderedConnection | null,
  ): boolean {
    if (!movingConnection || !destConnection) {
      return false;
    }
    const movingBlock = movingConnection.getSourceBlock();
    const checker = movingConnection.getConnectionChecker();

    if (
      checker.canConnect(movingConnection, destConnection, false) &&
      !destConnection.getSourceBlock().isShadow()
    ) {
      this.disconnectChild(movingConnection, destConnection);

      // Position the root block near the connection so it does not move the
      // other block when they are connected.
      if (!destConnection.isSuperior()) {
        const rootBlock = movingBlock.getRootBlock();

        const originalOffsetToTarget = {
          x: destConnection.x - movingConnection.x,
          y: destConnection.y - movingConnection.y,
        };
        const originalOffsetInBlock = movingConnection
          .getOffsetInBlock()
          .clone();
        rootBlock.positionNearConnection(
          movingConnection,
          originalOffsetToTarget,
          originalOffsetInBlock,
        );
      }
      destConnection.connect(movingConnection);
      return true;
    }
    return false;
  }

  /**
   * Tries to connect the given block to the destination connection, making an
   * intelligent guess about which connection to use on the moving block.
   *
   * @param block The block to move.
   * @param destConnection The connection to
   *     connect to.
   * @returns Whether the connection was successful.
   */
  insertBlock(
    block: Blockly.BlockSvg,
    destConnection: Blockly.RenderedConnection,
  ): boolean {
    switch (destConnection.type) {
      case Blockly.PREVIOUS_STATEMENT:
        if (this.connect(block.nextConnection, destConnection)) {
          return true;
        }
        break;
      case Blockly.NEXT_STATEMENT:
        if (this.connect(block.previousConnection, destConnection)) {
          return true;
        }
        break;
      case Blockly.INPUT_VALUE:
        if (this.connect(block.outputConnection, destConnection)) {
          return true;
        }
        break;
      case Blockly.OUTPUT_VALUE:
        for (let i = 0; i < block.inputList.length; i++) {
          const inputConnection = block.inputList[i].connection;
          if (
            inputConnection &&
            inputConnection.type === Blockly.INPUT_VALUE &&
            this.connect(
              inputConnection as Blockly.RenderedConnection,
              destConnection,
            )
          ) {
            return true;
          }
        }
        // If there are no input values pass the output and destination
        // connections to connect_ to find a way to connect the two.
        if (
          block.outputConnection &&
          this.connect(block.outputConnection, destConnection)
        ) {
          return true;
        }
        break;
    }
    this.warn('This block can not be inserted at the marked location.');
    return false;
  }

  /**
   * Enables accessibility mode.
   *
   * @param workspace The workspace to enable keyboard
   *     accessibility mode on.
   */
  enableKeyboardAccessibility(workspace: Blockly.WorkspaceSvg) {
    if (
      this.workspaces.includes(workspace) &&
      !workspace.keyboardAccessibilityMode
    ) {
      workspace.keyboardAccessibilityMode = true;
    }
  }

  /**
   * Disables accessibility mode.
   *
   * @param workspace The workspace to disable keyboard
   *     accessibility mode on.
   */
  disableKeyboardAccessibility(workspace: Blockly.WorkspaceSvg) {
    if (
      this.workspaces.includes(workspace) &&
      workspace.keyboardAccessibilityMode
    ) {
      workspace.keyboardAccessibilityMode = false;
    }
  }

  /**
   * Navigation log handler. If loggingCallback is defined, use it.
   * Otherwise just log to the console.log.
   *
   * @param msg The message to log.
   */
  log(msg: string) {
    console.log(msg);
  }

  /**
   * Navigation warning handler. If loggingCallback is defined, use it.
   * Otherwise call console.warn.
   *
   * @param msg The warning message.
   */
  warn(msg: string) {
    console.warn(msg);
  }

  /**
   * Navigation error handler. If loggingCallback is defined, use it.
   * Otherwise call console.error.
   *
   * @param msg The error message.
   */
  error(msg: string) {
    console.error(msg);
  }

  /**
   * Save the current cursor location and open the toolbox or flyout
   * to select and insert a block.
   *
   * @param workspace The active workspace.
   */
  openToolboxOrFlyout(workspace: Blockly.WorkspaceSvg) {
    const toolbox = workspace.getToolbox();
    const flyout = workspace.getFlyout();
    if (toolbox) {
      Blockly.getFocusManager().focusTree(toolbox);
    } else if (flyout) {
      Blockly.getFocusManager().focusTree(flyout.getWorkspace());
    }
  }

  /**
   * Pastes the copied block to the marked location if possible or
   * onto the workspace otherwise.
   *
   * @param copyData The data to paste into the workspace.
   * @param workspace The workspace to paste the data into.
   * @returns True if the paste was sucessful, false otherwise.
   */
  paste(copyData: Blockly.ICopyData, workspace: Blockly.WorkspaceSvg): boolean {
    // Do this before clipoard.paste due to cursor/focus workaround in getCurNode.
    const targetNode = workspace.getCursor().getCurNode();

    Blockly.Events.setGroup(true);
    const block = Blockly.clipboard.paste(
      copyData,
      workspace,
    ) as Blockly.BlockSvg;
    if (block) {
      if (targetNode) {
        this.tryToConnectBlock(targetNode, block);
      }
      return true;
    }
    Blockly.Events.setGroup(false);
    return false;
  }

  /**
   * Determines whether keyboard navigation should be allowed based on the
   * current state of the workspace.
   *
   * A return value of 'true' generally indicates that either the workspace,
   * toolbox or flyout has enabled keyboard navigation and is currently in a
   * state (e.g. focus) that can support keyboard navigation.
   *
   * @param workspace the workspace in which keyboard navigation may be allowed.
   * @returns whether keyboard navigation is currently allowed.
   */
  canCurrentlyNavigate(workspace: Blockly.WorkspaceSvg) {
    // Only the main/root workspace has the accessibility mode bit set; for
    // nested workspaces (mutators or flyouts) we need to walk up the tree.
    // Default to the root workspace if present. Flyouts don't consider
    // their workspaces to have a root workspace/be a nested child, so fall
    // back to checking the target workspace's root (`.targetWorkspace` only
    // exists on flyout workspaces) and then fall back to the target/main
    // workspace itself.
    const accessibilityMode = (
      workspace.getRootWorkspace() ??
      workspace.targetWorkspace?.getRootWorkspace() ??
      workspace.targetWorkspace ??
      workspace
    ).keyboardAccessibilityMode;
    return !!accessibilityMode && this.getState() !== Constants.STATE.NOWHERE;
  }

  /**
   * Determines whether the provided workspace is currently keyboard navigable
   * and editable.
   *
   * For the navigability criteria, see canCurrentlyKeyboardNavigate.
   *
   * @param workspace the workspace in which keyboard editing may be allowed.
   * @returns whether keyboard navigation and editing is currently allowed.
   */
  canCurrentlyEdit(workspace: Blockly.WorkspaceSvg) {
    return this.canCurrentlyNavigate(workspace) && !workspace.isReadOnly();
  }

  /**
   * Removes the change listeners on all registered workspaces.
   */
  dispose() {
    for (const workspace of this.workspaces) {
      this.removeWorkspace(workspace);
    }
  }
}
