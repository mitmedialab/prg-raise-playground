/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import { NavigationController } from './navigation_controller';

/**
 * Global shortcut handler that works anywhere on the page.
 */
export class GlobalShortcuts {
    private workspace: Blockly.WorkspaceSvg;
    private navigationController: NavigationController;
    private globalKeyHandler: (e: KeyboardEvent) => void;

    constructor(
        workspace: Blockly.WorkspaceSvg,
        navigationController: NavigationController,
    ) {
        this.workspace = workspace;
        this.navigationController = navigationController;

        this.globalKeyHandler = this.handleGlobalKeypress.bind(this);
    }

    /**
     * Install global keyboard listeners.
     */
    install() {
        // Use capture phase to intercept before other handlers
        document.addEventListener('keydown', this.globalKeyHandler, true);
    }

    /**
     * Remove global keyboard listeners.
     */
    uninstall() {
        document.removeEventListener('keydown', this.globalKeyHandler, true);
    }

    /**
     * Handle global keypresses.
     */
    private handleGlobalKeypress(e: KeyboardEvent) {
        // Don't interfere with input fields, textareas, etc.
        const target = e.target as HTMLElement;
        if (this.shouldIgnoreTarget(target)) {
            return;
        }

        // Don't trigger if modifiers are pressed (except shift for capitals)
        if (e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }

        switch (e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                e.stopPropagation();
                this.openToolbox();
                break;

            case 'r':
                e.preventDefault();
                e.stopPropagation();
                this.focusRunButton();
                break;

            case 'w':
                e.preventDefault();
                e.stopPropagation();
                this.focusWorkspace();
                break;

            case 's':
                e.preventDefault();
                e.stopPropagation();
                this.focusSettingsButton();
                break;
        }
    }

    /**
 * Find and focus the settings button.
 */
    private focusSettingsButton() {
        // Find button by ID
        const settingsButton = document.getElementById('settings-button');

        if (settingsButton instanceof HTMLElement) {
            settingsButton.focus();

            // Optionally scroll into view if the button is not visible
            settingsButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            console.warn('Could not find Settings button with id="settings-button"');
        }
    }

    /**
     * Check if we should ignore keyboard events from this target.
     */
    private shouldIgnoreTarget(target: HTMLElement): boolean {
        const tagName = target.tagName.toLowerCase();

        // Ignore if typing in an input field
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
            return true;
        }

        // Ignore if element is contenteditable
        if (target.isContentEditable) {
            return true;
        }

        // Ignore if inside a Blockly text input
        if (target.closest('.blocklyHtmlInput')) {
            return true;
        }

        return false;
    }

    /**
     * Open toolbox and focus it.
     */
    private openToolbox() {
        // Enable keyboard navigation if not already enabled
        if (!this.workspace.keyboardAccessibilityMode) {
            this.navigationController.enable(this.workspace);
        }

        // Focus the workspace first to ensure proper state
        Blockly.getFocusManager().focusTree(this.workspace);

        // Then focus the toolbox
        if (this.workspace.getToolbox()) {
            Blockly.getFocusManager().focusTree(this.workspace.getToolbox()!);
        } else {
            // If no toolbox, try flyout
            Blockly.getFocusManager().focusTree(this.workspace.getFlyout()!);
        }
    }

    /**
     * Find and focus the "Run Code!" button.
     */
    private focusRunButton() {
        // Find button by ID - most reliable method
        const runButton = document.getElementById('run');

        if (runButton instanceof HTMLElement) {
            runButton.focus();

            // Optionally scroll into view if the button is not visible
            runButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            console.warn('Could not find Run Code button with id="run"');
        }
    }

    /**
     * Focus the workspace and enable keyboard navigation if needed.
     */
    private focusWorkspace() {
        // Enable keyboard navigation if not already enabled
        if (!this.workspace.keyboardAccessibilityMode) {
            this.navigationController.enable(this.workspace);
        }

        // Focus the workspace
        Blockly.getFocusManager().focusTree(this.workspace);
    }
}