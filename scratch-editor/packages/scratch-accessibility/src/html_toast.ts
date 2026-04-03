/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

/**
 * Configuration options for toasts.
 */
interface HtmlToastOptions extends Blockly.ToastOptions {
  element?: HTMLElement;
}

/**
 * Custom toast implementation that supports HTML elements in toast messages.
 *
 * After registering, call 
  `Blockly.dialog.toast(workspace, {element: <html element>, message: <text>});`
 * to display an HTML-based toast.
 */
class HtmlToast extends Blockly.Toast {
  /**
   * Creates the body of the toast for display.
   *
   * @param workspace The workspace the toast will be displayed on.
   * @param options Configuration options for toast appearance/behavior.
   * @returns The body for the toast.
   */
  protected static override createDom(
    workspace: Blockly.WorkspaceSvg,
    options: HtmlToastOptions,
  ) {
    const dom = super.createDom(workspace, options);
    const contents = dom.querySelector('div');
    if (
      contents &&
      'element' in options &&
      options.element instanceof HTMLElement
    ) {
      contents.innerHTML = '';
      contents.appendChild(options.element);
    }
    return dom;
  }
}

/**
 * Registers HtmlToast as the default toast implementation for Blockly.
 */
export function registerHtmlToast() {
  Blockly.dialog.setToast(HtmlToast.show.bind(HtmlToast));
}
