/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

/**
 * Toolbox class that does not handle keyboard navigation.
 */
export class NavigationDeferringToolbox extends Blockly.Toolbox {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected override onKeyDown_(e: KeyboardEvent) {
    // No-op, prevent keyboard handling by superclass in order to defer to
    // global keyboard navigation.
  }
}

/**
 * Registers the navigation-deferring toolbox with Blockly.
 */
export function registerNavigationDeferringToolbox() {
  Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX,
    Blockly.registry.DEFAULT,
    NavigationDeferringToolbox,
    true,
  );
}
