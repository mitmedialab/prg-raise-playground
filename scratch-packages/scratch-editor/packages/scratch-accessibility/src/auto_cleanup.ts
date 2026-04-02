/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Automatic workspace cleanup functionality.
 * Organizes blocks automatically when they are added or removed.
 */

import * as Blockly from 'blockly/core';

/**
 * Class to handle automatic workspace cleanup when blocks are added or removed.
 * This keeps the workspace organized without requiring manual intervention.
 */
export class AutoCleanup {
    private workspace: Blockly.WorkspaceSvg;
    private cleanupTimeout: number | null = null;
    private readonly CLEANUP_DELAY = 100; // Delay in ms before cleanup

    /**
     * Constructs the auto cleanup functionality.
     *
     * @param workspace The workspace that will be automatically organized.
     */
    constructor(workspace: Blockly.WorkspaceSvg) {
        this.workspace = workspace;
        this.initEventListeners();
    }

    /**
     * Initialize event listeners for block creation and deletion.
     */
    private initEventListeners(): void {
        this.workspace.addChangeListener((event: Blockly.Events.Abstract) => {
            // Only cleanup for create and delete events
            if (event.type === Blockly.Events.BLOCK_CREATE ||
                event.type === Blockly.Events.BLOCK_DELETE) {
                this.scheduleCleanup();
            }
        });
    }

    /**
     * Schedule a cleanup with debouncing to avoid excessive cleanups.
     * If multiple blocks are added/removed quickly, this will only
     * clean up once after the operations are complete.
     */
    private scheduleCleanup(): void {
        // Clear any existing timeout
        if (this.cleanupTimeout) {
            clearTimeout(this.cleanupTimeout);
        }

        // Schedule new cleanup
        this.cleanupTimeout = window.setTimeout(() => {
            this.performCleanup();
            this.cleanupTimeout = null;
        }, this.CLEANUP_DELAY);
    }

    /**
     * Perform the actual workspace cleanup.
     */
    private performCleanup(): void {
        // Only cleanup if workspace is not read-only and has blocks
        if (!this.workspace.options.readOnly &&
            this.workspace.getTopBlocks(false).length > 0) {

            // Disable events during cleanup to avoid infinite loops
            Blockly.Events.disable();
            try {
                this.workspace.cleanUp();
            } finally {
                Blockly.Events.enable();
            }
        }
    }

    /**
     * Dispose of the auto cleanup functionality.
     * Clears any pending cleanup operations.
     */
    dispose(): void {
        if (this.cleanupTimeout) {
            clearTimeout(this.cleanupTimeout);
            this.cleanupTimeout = null;
        }
    }
}