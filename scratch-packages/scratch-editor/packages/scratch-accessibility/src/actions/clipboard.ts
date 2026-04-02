/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ContextMenuRegistry,
  ShortcutRegistry,
  isCopyable,
  Msg,
  ShortcutItems,
  WorkspaceSvg,
  clipboard,
  isSelectable,
} from 'blockly';
import * as Constants from '../constants';
import {Navigation} from '../navigation';
import {getMenuItem} from '../shortcut_formatting';
import {clearPasteHints, showCopiedHint, showCutHint} from '../hints';

/**
 * Weight for the first of these three items in the context menu.
 * Changing base weight will change where this group goes in the context
 * menu; changing individual weights relative to base weight can change
 * the order within the clipboard group.
 */
const BASE_WEIGHT = 12;

/**
 * Logic and state for cut/copy/paste actions as both keyboard shortcuts
 * and context menu items.
 * In the long term, this will likely merge with the clipboard code in core.
 */
export class Clipboard {
  private oldCutShortcut: ShortcutRegistry.KeyboardShortcut | undefined;
  private oldCopyShortcut: ShortcutRegistry.KeyboardShortcut | undefined;
  private oldPasteShortcut: ShortcutRegistry.KeyboardShortcut | undefined;

  constructor(
    private navigation: Navigation,
    private options: {allowCrossWorkspacePaste: boolean} = {
      allowCrossWorkspacePaste: false,
    },
  ) {}

  /**
   * Install these actions as both keyboard shortcuts and context menu items.
   */
  install() {
    this.registerCopyShortcut();
    this.registerCopyContextMenuAction();

    this.registerPasteShortcut();
    this.registerPasteContextMenuAction();

    this.registerCutShortcut();
    this.registerCutContextMenuAction();
  }

  /**
   * Uninstall this action as both a keyboard shortcut and a context menu item.
   * Reinstall the original cut/copy/paste shortcuts.
   */
  uninstall() {
    ContextMenuRegistry.registry.unregister('blockCutFromContextMenu');
    ContextMenuRegistry.registry.unregister('blockCopyFromContextMenu');
    ContextMenuRegistry.registry.unregister('blockPasteFromContextMenu');

    ShortcutRegistry.registry.unregister(Constants.SHORTCUT_NAMES.CUT);
    ShortcutRegistry.registry.unregister(Constants.SHORTCUT_NAMES.COPY);
    ShortcutRegistry.registry.unregister(Constants.SHORTCUT_NAMES.PASTE);

    if (this.oldCutShortcut) {
      ShortcutRegistry.registry.register(this.oldCutShortcut);
    }

    if (this.oldCopyShortcut) {
      ShortcutRegistry.registry.register(this.oldCopyShortcut);
    }

    if (this.oldPasteShortcut) {
      ShortcutRegistry.registry.register(this.oldPasteShortcut);
    }
  }

  /**
   * Create and register the keyboard shortcut for the cut action.
   * Identical to the one in core but adds a toast after successful cut.
   */
  private registerCutShortcut() {
    this.oldCutShortcut =
      ShortcutRegistry.registry.getRegistry()[ShortcutItems.names.CUT];
    if (!this.oldCutShortcut)
      throw new Error('No cut keyboard shortcut registered initially');

    const cutShortcut: ShortcutRegistry.KeyboardShortcut = {
      name: Constants.SHORTCUT_NAMES.CUT,
      preconditionFn: this.oldCutShortcut.preconditionFn,
      callback: this.cutCallback.bind(this),
      keyCodes: this.oldCutShortcut.keyCodes,
      allowCollision: false,
    };

    ShortcutRegistry.registry.unregister(ShortcutItems.names.CUT);
    ShortcutRegistry.registry.register(cutShortcut);
  }

  /**
   * Register the cut block action as a context menu item.
   * The context menu uses its own preconditionFn (that doesn't check
   * if a gesture is in progress, because one always is in the context
   * menu). It calls the cut callback that is shared between keyboard
   * and context menu.
   */
  private registerCutContextMenuAction() {
    const cutAction: ContextMenuRegistry.RegistryItem = {
      displayText: (scope) =>
        getMenuItem(Msg['CUT_SHORTCUT'], Constants.SHORTCUT_NAMES.CUT),
      preconditionFn: (scope) => this.cutPrecondition(scope),
      callback: (scope, menuOpenEvent) => {
        if (!isCopyable(scope.focusedNode)) return false;
        const ws = scope.focusedNode.workspace;
        if (!(ws instanceof WorkspaceSvg)) return false;

        return this.cutCallback(ws, menuOpenEvent, undefined, scope);
      },
      id: 'blockCutFromContextMenu',
      weight: BASE_WEIGHT,
    };

    ContextMenuRegistry.registry.register(cutAction);
  }

  /**
   * Precondition function for the cut context menu. This wraps the core cut
   * precondition to support context menus.
   *
   * @param scope scope of the shortcut or context menu item
   * @returns 'enabled' if the node can be cut, 'disabled' otherwise.
   */
  private cutPrecondition(scope: ContextMenuRegistry.Scope): string {
    const focused = scope.focusedNode;
    if (!focused || !isCopyable(focused)) return 'hidden';

    const workspace = focused.workspace;
    if (!(workspace instanceof WorkspaceSvg)) return 'hidden';

    if (
      this.oldCutShortcut?.preconditionFn &&
      this.oldCutShortcut.preconditionFn(workspace, scope)
    ) {
      return 'enabled';
    }
    return 'disabled';
  }

  /**
   * The callback for the cut action. Uses the registered version of the cut callback
   * to perform the cut logic, then pops a toast if cut happened.
   *
   * @param workspace Workspace where shortcut happened.
   * @param e menu open event or keyboard event
   * @param shortcut keyboard shortcut or undefined for context menus
   * @param scope scope of the shortcut or context menu item
   * @returns true if a cut happened, false otherwise
   */
  private cutCallback(
    workspace: WorkspaceSvg,
    e: Event,
    shortcut: ShortcutRegistry.KeyboardShortcut = {
      name: Constants.SHORTCUT_NAMES.CUT,
    },
    scope: ContextMenuRegistry.Scope,
  ) {
    const didCut =
      !!this.oldCutShortcut?.callback &&
      this.oldCutShortcut.callback(workspace, e, shortcut, scope);
    if (didCut) {
      showCutHint(workspace);
    }
    return didCut;
  }

  /**
   * Create and register the keyboard shortcut for the copy action.
   * Identical to the one in core but pops a toast after succesful copy.
   */
  private registerCopyShortcut() {
    this.oldCopyShortcut =
      ShortcutRegistry.registry.getRegistry()[ShortcutItems.names.COPY];
    if (!this.oldCopyShortcut)
      throw new Error('No copy keyboard shortcut registered initially');

    const copyShortcut: ShortcutRegistry.KeyboardShortcut = {
      name: Constants.SHORTCUT_NAMES.COPY,
      preconditionFn: this.oldCopyShortcut.preconditionFn,
      callback: this.copyCallback.bind(this),
      keyCodes: this.oldCopyShortcut.keyCodes,
      allowCollision: false,
    };

    ShortcutRegistry.registry.unregister(ShortcutItems.names.COPY);
    ShortcutRegistry.registry.register(copyShortcut);
  }

  /**
   * Register the copy block action as a context menu item.
   * The context menu uses its own preconditionFn (that doesn't check
   * if a gesture is in progress, because one always is in the context
   * menu). It calls the copy callback that is shared between keyboard
   * and context menu.
   */
  private registerCopyContextMenuAction() {
    const copyAction: ContextMenuRegistry.RegistryItem = {
      displayText: (scope) =>
        getMenuItem(Msg['COPY_SHORTCUT'], Constants.SHORTCUT_NAMES.COPY),
      preconditionFn: (scope) => this.copyPrecondition(scope),
      callback: (scope, menuOpenEvent) => {
        if (!isCopyable(scope.focusedNode)) return false;
        const ws = scope.focusedNode.workspace;
        if (!(ws instanceof WorkspaceSvg)) return false;

        return this.copyCallback(ws, menuOpenEvent, undefined, scope);
      },
      id: 'blockCopyFromContextMenu',
      weight: BASE_WEIGHT + 1,
    };

    ContextMenuRegistry.registry.register(copyAction);
  }

  /**
   * Precondition function for the copy context menu. This wraps the core copy
   * precondition to support context menus.
   *
   * @param scope scope of the shortcut or context menu item
   * @returns 'enabled' if the node can be copied, 'disabled' otherwise.
   */
  private copyPrecondition(scope: ContextMenuRegistry.Scope): string {
    const focused = scope.focusedNode;
    if (!focused || !isCopyable(focused)) return 'hidden';

    const workspace = focused.workspace;
    if (!(workspace instanceof WorkspaceSvg)) return 'hidden';

    if (
      this.oldCopyShortcut?.preconditionFn &&
      this.oldCopyShortcut.preconditionFn(workspace, scope)
    ) {
      return 'enabled';
    }
    return 'disabled';
  }

  /**
   * The callback for the copy action. Uses the registered version of the copy callback
   * to perform the copy logic, then pops a toast if copy happened.
   *
   * @param workspace Workspace where shortcut happened.
   * @param e menu open event or keyboard event
   * @param shortcut keyboard shortcut or undefined for context menus
   * @param scope scope of the shortcut or context menu item
   * @returns true if a copy happened, false otherwise
   */
  private copyCallback(
    workspace: WorkspaceSvg,
    e: Event,
    shortcut: ShortcutRegistry.KeyboardShortcut = {
      name: Constants.SHORTCUT_NAMES.CUT,
    },
    scope: ContextMenuRegistry.Scope,
  ) {
    const didCopy =
      !!this.oldCopyShortcut?.callback &&
      this.oldCopyShortcut.callback(workspace, e, shortcut, scope);
    if (didCopy) {
      showCopiedHint(workspace);
    }
    return didCopy;
  }

  /**
   * Create and register the keyboard shortcut for the paste action.
   * Identical to the one in core but clears any paste toasts after.
   */
  private registerPasteShortcut() {
    this.oldPasteShortcut =
      ShortcutRegistry.registry.getRegistry()[ShortcutItems.names.PASTE];
    if (!this.oldPasteShortcut)
      throw new Error('No paste keyboard shortcut registered initially');

    const pasteShortcut: ShortcutRegistry.KeyboardShortcut = {
      name: Constants.SHORTCUT_NAMES.PASTE,
      preconditionFn: this.oldPasteShortcut.preconditionFn,
      callback: this.pasteCallback.bind(this),
      keyCodes: this.oldPasteShortcut.keyCodes,
      allowCollision: false,
    };

    ShortcutRegistry.registry.unregister(ShortcutItems.names.PASTE);
    ShortcutRegistry.registry.register(pasteShortcut);
  }

  /**
   * Register the paste block action as a context menu item.
   * The context menu uses its own preconditionFn (that doesn't check
   * if a gesture is in progress, because one always is in the context
   * menu). It calls the paste callback that is shared between keyboard
   * and context menu.
   */
  private registerPasteContextMenuAction() {
    const pasteAction: ContextMenuRegistry.RegistryItem = {
      displayText: (scope) =>
        getMenuItem(Msg['PASTE_SHORTCUT'], Constants.SHORTCUT_NAMES.PASTE),
      preconditionFn: (scope) => this.pastePrecondition(scope),
      callback: (scope: ContextMenuRegistry.Scope, menuOpenEvent: Event) => {
        const workspace = this.getPasteWorkspace(scope);
        if (!workspace) return false;
        return this.pasteCallback(workspace, menuOpenEvent, undefined, scope);
      },
      id: 'blockPasteFromContextMenu',
      weight: BASE_WEIGHT + 2,
    };

    ContextMenuRegistry.registry.register(pasteAction);
  }

  /**
   * Get the workspace to paste into based on which type of thing the menu was opened on.
   *
   * @param scope scope of shortcut or context menu item
   * @returns WorkspaceSvg to paste into or undefined
   */
  private getPasteWorkspace(
    scope: ContextMenuRegistry.Scope,
  ): WorkspaceSvg | undefined {
    let workspace;
    if (scope.focusedNode instanceof WorkspaceSvg) {
      workspace = scope.focusedNode;
    } else if (isSelectable(scope.focusedNode)) {
      workspace = scope.focusedNode.workspace;
    }

    if (!workspace || !(workspace instanceof WorkspaceSvg)) return undefined;
    return workspace;
  }

  /**
   * Precondition function for the paste context menu. This wraps the core
   * paste precondition to support context menus.
   *
   * @param scope scope of the shortcut or context menu item
   * @returns 'enabled' if the node can be pasted, 'disabled' otherwise.
   */
  private pastePrecondition(scope: ContextMenuRegistry.Scope): string {
    const workspace = this.getPasteWorkspace(scope);
    // If we can't identify what workspace to paste into, hide.
    if (!workspace) return 'hidden';

    // Don't paste into flyouts.
    if (workspace.isFlyout) return 'hidden';

    if (!this.options.allowCrossWorkspacePaste) {
      // Only paste into the same workspace that was copied from
      // or the parent workspace of a flyout that was copied from.
      let copiedWorkspace = clipboard.getLastCopiedWorkspace();
      if (copiedWorkspace?.isFlyout)
        copiedWorkspace = copiedWorkspace.targetWorkspace;
      if (copiedWorkspace !== workspace) return 'disabled';
    }

    if (
      this.oldPasteShortcut?.preconditionFn &&
      this.oldPasteShortcut.preconditionFn(workspace, scope)
    ) {
      return 'enabled';
    }
    return 'disabled';
  }

  /**
   * The callback for the paste action. Uses the registered version of the paste callback
   * to perform the paste logic, then clears any toasts about pasting.
   *
   * @param workspace Workspace where shortcut happened.
   * @param e menu open event or keyboard event
   * @param shortcut keyboard shortcut or undefined for context menus
   * @param scope scope of the shortcut or context menu item
   * @returns true if a paste happened, false otherwise
   */
  private pasteCallback(
    workspace: WorkspaceSvg,
    e: Event,
    shortcut: ShortcutRegistry.KeyboardShortcut = {
      name: Constants.SHORTCUT_NAMES.CUT,
    },
    scope: ContextMenuRegistry.Scope,
  ) {
    const didPaste =
      !!this.oldPasteShortcut?.callback &&
      this.oldPasteShortcut.callback(workspace, e, shortcut, scope);

    // Clear the paste hints regardless of whether something was pasted
    // Some implementations of paste are async and we should clear the hint
    // once the user initiates the paste action.
    clearPasteHints(workspace);
    return didPaste;
  }
}
