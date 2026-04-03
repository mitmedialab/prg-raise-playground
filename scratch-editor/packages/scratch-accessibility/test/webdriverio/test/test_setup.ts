/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Node.js script to run automated functional tests in
 * Chrome, via webdriver.
 *
 * This file is to be used in the suiteSetup for any automated fuctional test.
 *
 * Note: In this file many functions return browser elements that can
 * be clicked or otherwise interacted with through WebdriverIO. These
 * elements are not the raw HTML and SVG elements on the page; they are
 * identifiers that WebdriverIO can use to find those elements.
 */

import * as Blockly from 'blockly';
import * as webdriverio from 'webdriverio';
import * as path from 'path';
import {fileURLToPath} from 'url';

/**
 * The webdriverio instance, which should only be initialized once.
 */
let driver: webdriverio.Browser | null = null;

/**
 * The default amount of time to wait during a test, in ms.  Increase
 * this to make tests easier to watch; decrease it to make tests run
 * faster.
 *
 * The _test.js files in this directory are set up to disable timeouts
 * automatically when PAUSE_TIME is set to a nonzero value via
 *
 *     if (PAUSE_TIME) this.timeout(0);
 *
 * at the top of each suite.
 *
 * Tests should pass reliably even with this set to zero; use one of
 * the browser.wait* functions if you need your test to wait for
 * something to happen after sending input.
 */
export const PAUSE_TIME = 0;

let synchronizeCoreBlocklyRendering = true;

/**
 * Start up WebdriverIO and load the test page. This should only be
 * done once, to avoid constantly popping browser windows open and
 * closed.
 *
 * @param wdioWaitTimeoutMs The timeout for WebdriverIO waitFor*() commands, in
 *     milliseconds.
 * @returns A Promise that resolves to a WebdriverIO browser that
 *     tests can manipulate.
 */
export async function driverSetup(
  wdioWaitTimeoutMs: number,
): Promise<webdriverio.Browser> {
  const options = {
    capabilities: {
      'browserName': 'chrome',
      'unhandledPromptBehavior': 'ignore',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'goog:chromeOptions': {
        args: ['--allow-file-access-from-files'],
      },
      // We aren't (yet) using any BiDi features, and BiDi is sensitive to
      // mismatches between Chrome version and Chromedriver version.
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'wdio:enforceWebDriverClassic': true,
    },
    waitforTimeout: wdioWaitTimeoutMs,
    logLevel: 'warn' as const,
  };

  // Run in headless mode on Github Actions.
  if (process.env.CI) {
    options.capabilities['goog:chromeOptions'].args.push(
      '--headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
    );
  } else {
    // --disable-gpu is needed to prevent Chrome from hanging on Linux with
    // NVIDIA drivers older than v295.20. See
    // https://github.com/google/blockly/issues/5345 for details.
    options.capabilities['goog:chromeOptions'].args.push('--disable-gpu');
  }
  // Use webdriver to bring up the page
  console.log('Starting webdriverio...');
  driver = await webdriverio.remote(options);
  return driver;
}

/**
 * End the WebdriverIO session.
 *
 * @return A Promise that resolves after the actions have been completed.
 */
export async function driverTeardown() {
  await driver?.deleteSession();
  driver = null;
  return;
}

/**
 * Navigate to the correct URL for the test, using the shared driver.
 *
 * @param playgroundUrl The URL to open for the test, which should be
 *     a Blockly playground with a workspace.
 * @param wdioWaitTimeoutMs The timeout for WebdriverIO waitFor*() commands, in
 *     milliseconds. This should generally be synchronized with the default
 *     Mocah test timeout.
 * @returns A Promise that resolves to a WebdriverIO browser that
 *     tests can manipulate.
 */
export async function testSetup(
  playgroundUrl: string,
  wdioWaitTimeoutMs: number,
): Promise<webdriverio.Browser> {
  // Reset back to default state between tests.
  synchronizeCoreBlocklyRendering = true;

  if (!driver) {
    driver = await driverSetup(wdioWaitTimeoutMs);
  } else if (process.env.CI) {
    // If running in CI force a session reload to ensure no browser state can
    // leak across tests (since this can sometimes cause complex combined
    // failures in CI).
    await driver.reloadSession();
  }
  await driver.url(playgroundUrl);
  // Wait for the workspace to exist and be rendered.
  await driver
    .$('.blocklySvg .blocklyWorkspace > .blocklyBlockCanvas')
    .waitForExist();
  return driver;
}

/**
 * Checks whether the current test has finished in a 'failing state' and, if it
 * did, save a screenshot to the 'failures' directory with a name corresponding
 * to the current test's title.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param testTitle The current running test's title, if known.
 * @param testState The current running test's completion state, if known.
 */
export async function checkForFailures(
  browser: WebdriverIO.Browser,
  testTitle: string | undefined,
  testState: string | undefined,
) {
  if (testState === 'failed') {
    if (!testTitle) {
      throw new Error('Test failed and finished with no test title.');
    }
    await browser.saveScreenshot(`failures/${testTitle}.png`);
  }
}

/**
 * Replaces OS-specific path with POSIX style path.
 *
 * Simplified implementation based on
 * https://stackoverflow.com/a/63251716/4969945
 *
 * @param target target path
 * @returns posix path
 */
function posixPath(target: string): string {
  return target.split(path.sep).join(path.posix.sep);
}

// Relative to dist folder for TS build
export const createTestUrl = (options?: URLSearchParams) => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const base = new URL(
    `file://${posixPath(path.join(dirname, '..', '..', 'build', 'index.html'))}`,
  );
  base.search = options?.toString() ?? '';
  return base.toString();
};

export const testFileLocations = {
  BASE: createTestUrl(),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  NAVIGATION_TEST_BLOCKS: createTestUrl(
    new URLSearchParams({scenario: 'navigationTestBlocks'}),
  ),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MORE_BLOCKS: createTestUrl(new URLSearchParams({scenario: 'moreBlocks'})),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MOVE_START_TEST_BLOCKS: createTestUrl(
    new URLSearchParams({scenario: 'moveStartTestBlocks'}),
  ),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MOVE_STATEMENT_TEST_BLOCKS: createTestUrl(
    new URLSearchParams({scenario: 'moveStatementTestBlocks'}),
  ),
  COMMENTS: createTestUrl(new URLSearchParams({scenario: 'comments'})),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BASE_RTL: createTestUrl(new URLSearchParams({rtl: 'true'})),
  GERAS: createTestUrl(new URLSearchParams({renderer: 'geras'})),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GERAS_RTL: createTestUrl(
    new URLSearchParams({renderer: 'geras', rtl: 'true'}),
  ),
};

/**
 * Copied from blockly browser test_setup.mjs and amended for typescript
 *
 * @param browser The active WebdriverIO Browser object.
 * @returns A Promise that resolves to the ID of the currently selected block.
 */
export async function getSelectedBlockId(browser: WebdriverIO.Browser) {
  return await browser.execute(() => {
    // Note: selected is an ICopyable and I am assuming that it is a BlockSvg.
    return Blockly.common.getSelected()?.id;
  });
}

/**
 * Pauses the browser for PAUSE_TIME, also possibly synchronizing rendering in
 * core Blockly.
 *
 * This generally should always be preferred over calling browser.pause()
 * directly.
 *
 * See setSynchronizeCoreBlocklyRendering() for additional details on
 * configuring how this function behaves.
 *
 * @param browser The active WebdriverIO Browser object.
 */
export async function pause(browser: WebdriverIO.Browser) {
  if (synchronizeCoreBlocklyRendering) {
    // First, attempt to synchronize on rendering to ensure that Blockly is
    // fully rendered before pausing for browser execution. This works around
    // potential bugs when running in headless mode that can cause
    // requestAnimationFrame to not call back (and cause state inconsistencies
    // in block positions and sizes per #770).
    await browser.execute(() => {
      const workspace = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
      // Queue re-rendering all blocks.
      workspace.render();
      // Flush the rendering queue (this is a slight hack to leverage
      // BlockSvg.render() directly blocking on rendering finishing).
      const blocks = workspace.getTopBlocks();
      if (blocks.length > 0) {
        blocks[0].render();
      }
    });
  }
  await browser.pause(PAUSE_TIME);
}

/**
 * Configures whether to synchronize core Blockly's rendering system when trying
 * to pause tests to wait for operations to complete.
 *
 * This is enabled by default and changes the behavior of pause() which is used
 * both directly in tests and indirectly via the many test helpers in this file.
 *
 * Synchronization is useful because it ensures Blockly is fully rendered and
 * stable before proceeding with the test (which can sometimes be desynchronized
 * if the headless test environment drops a request for animation rendering
 * frame which has been observed in CI environments).
 *
 * Synchronization must be disabled in certain tests, particularly those that
 * can trigger alert dialogs since, when open, these will always cause any
 * browser.execute() calls to fail the test (and rendering synchronization
 * relies on this WebdriverIO mechanism).
 *
 * @param syncRendering Whether to synchronize Blockly rendering when pausing
 *     test execution using pause().
 */
export function setSynchronizeCoreBlocklyRendering(syncRendering: boolean) {
  synchronizeCoreBlocklyRendering = syncRendering;
}

/**
 * Clicks in the workspace to focus it.
 *
 * @param browser The active WebdriverIO Browser object.
 */
export async function focusWorkspace(browser: WebdriverIO.Browser) {
  const workspaceElement = await browser.$(
    '#blocklyDiv > div > svg.blocklySvg > g',
  );
  await workspaceElement.click({x: 100});
  await pause(browser);
}

/**
 * Focuses the toolbox category with the given name.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param category The name of the toolbox category to focus.
 */
export async function moveToToolboxCategory(
  browser: WebdriverIO.Browser,
  category: string,
) {
  await sendKeyAndWait(browser, 't');
  const categoryIndex = await browser.execute((category) => {
    const all = Array.from(
      document.querySelectorAll('.blocklyToolboxCategoryLabel'),
    ).map((node) => node.textContent);
    return all.indexOf(category);
  }, category);
  if (categoryIndex < 0) {
    throw new Error(`No category found: ${category}`);
  }
  if (categoryIndex > 0) await keyDown(browser, categoryIndex);
}

/**
 * Returns whether the workspace contains a block with the given id.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param blockId The id of the block.
 */
export async function blockIsPresent(
  browser: WebdriverIO.Browser,
  blockId: string,
): Promise<boolean> {
  return await browser.execute((blockId) => {
    const workspaceSvg = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    const block = workspaceSvg.getBlockById(blockId);
    return block !== null;
  }, blockId);
}

/**
 * Returns whether the main workspace is the current focus.
 *
 * @param browser The active WebdriverIO Browser object.
 */
export async function currentFocusIsMainWorkspace(
  browser: WebdriverIO.Browser,
): Promise<boolean> {
  return await browser.execute(() => {
    const workspaceSvg = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    return Blockly.getFocusManager().getFocusedNode() === workspaceSvg;
  });
}

/**
 * Returns whether the currently focused tree is the main workspace.
 *
 * @param browser The active WebdriverIO Browser object.
 */
export async function focusedTreeIsMainWorkspace(
  browser: WebdriverIO.Browser,
): Promise<boolean> {
  return await browser.execute(() => {
    const workspaceSvg = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    return Blockly.getFocusManager().getFocusedTree() === workspaceSvg;
  });
}

/**
 * Focuses and selects a block with the provided ID.
 *
 * This throws an error if no block exists for the specified ID.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param blockId The ID of the block to select.
 */
export async function focusOnBlock(
  browser: WebdriverIO.Browser,
  blockId: string,
) {
  await browser.execute((blockId) => {
    const workspaceSvg = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    const block = workspaceSvg.getBlockById(blockId);
    if (!block) throw new Error(`No block found with ID: ${blockId}.`);
    Blockly.getFocusManager().focusNode(block);
  }, blockId);
  await pause(browser);
}

/**
 * Focuses and selects a workspace comment with the provided ID.
 *
 * This throws an error if no workspace comment exists for the specified ID.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param commentId The ID of the workspace comment to select.
 */
export async function focusOnWorkspaceComment(
  browser: WebdriverIO.Browser,
  commentId: string,
) {
  await browser.execute((commentId) => {
    const workspaceSvg = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    const comment = workspaceSvg.getCommentById(commentId);
    if (!comment) {
      throw new Error(`No workspace comment found with ID: ${commentId}.`);
    }
    Blockly.getFocusManager().focusNode(comment);
  }, commentId);
  await pause(browser);
}

/**
 * Focuses and selects the field of a block given a block ID and field name.
 *
 * This throws an error if no block exists for the specified ID, or if the block
 * corresponding to the specified ID has no field with the provided name.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param blockId The ID of the block to select.
 * @param fieldName The name of the field on the block to select.
 */
export async function focusOnBlockField(
  browser: WebdriverIO.Browser,
  blockId: string,
  fieldName: string,
) {
  await browser.execute(
    (blockId, fieldName) => {
      const workspaceSvg = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
      const block = workspaceSvg.getBlockById(blockId);
      if (!block) throw new Error(`No block found with ID: ${blockId}.`);
      const field = block.getField(fieldName);
      if (!field) {
        throw new Error(`No field found: ${fieldName} (block ${blockId}).`);
      }
      Blockly.getFocusManager().focusNode(field);
    },
    blockId,
    fieldName,
  );
  await pause(browser);
}

/**
 * Get the ID of the node that is currently focused.
 *
 * @param browser The active WebdriverIO Browser object.
 * @returns A Promise that resolves to the ID of the current cursor node.
 */
export async function getCurrentFocusNodeId(
  browser: WebdriverIO.Browser,
): Promise<string | undefined> {
  return await browser.execute(() => {
    return Blockly.getFocusManager().getFocusedNode()?.getFocusableElement()
      ?.id;
  });
}

/**
 * Get the ID of the block that is currently focused.
 *
 * @param browser The active WebdriverIO Browser object.
 * @returns A Promise that resolves to the ID of the currently focused block.
 */
export async function getCurrentFocusedBlockId(
  browser: WebdriverIO.Browser,
): Promise<string | undefined> {
  return await browser.execute(() => {
    const focusedNode = Blockly.getFocusManager().getFocusedNode();
    if (focusedNode && focusedNode instanceof Blockly.BlockSvg) {
      return focusedNode.id;
    }
    return undefined;
  });
}

/**
 * Get the block type of the current focused node. Assumes the current node
 * is a block.
 *
 * @param browser The active WebdriverIO Browser object.
 * @returns A Promise that resolves to the block type of the current cursor
 * node.
 */
export async function getFocusedBlockType(
  browser: WebdriverIO.Browser,
): Promise<string | undefined> {
  return await browser.execute(() => {
    const block = Blockly.getFocusManager().getFocusedNode() as
      | Blockly.BlockSvg
      | undefined;
    return block?.type;
  });
}

/**
 * Get the connection type of the current focused node. Assumes the current node
 * is a connection.
 *
 * @param browser The active WebdriverIO Browser object.
 * @returns A Promise that resolves to the connection type of the current cursor
 * node.
 */
export async function getFocusedConnectionType(
  browser: WebdriverIO.Browser,
): Promise<number | undefined> {
  return await browser.execute(() => {
    const connection =
      Blockly.getFocusManager().getFocusedNode() as Blockly.RenderedConnection;
    return connection.type;
  });
}

/**
 * Get the field name of the current focused node. Assumes the current node
 * is a field.
 *
 * @param browser The active WebdriverIO Browser object.
 * @returns A Promise that resolves to the field name of the current focused
 * node.
 */
export async function getFocusedFieldName(
  browser: WebdriverIO.Browser,
): Promise<string | undefined> {
  return await browser.execute(() => {
    const field = Blockly.getFocusManager().getFocusedNode() as Blockly.Field;
    return field.name;
  });
}

export interface ElementWithId extends WebdriverIO.Element {
  id: string;
}

/**
 * Copied from blockly browser test_setup.mjs and amended for typescript
 *
 * @param browser The active WebdriverIO Browser object.
 * @param id The ID of the Blockly block to search for.
 * @returns A Promise that resolves to the root SVG element of the block with
 *     the given ID, as an interactable browser element.
 */
export async function getBlockElementById(
  browser: WebdriverIO.Browser,
  id: string,
) {
  const elem = (await browser.$(
    `[data-id="${id}"]`,
  )) as unknown as ElementWithId;
  elem['id'] = id;
  return elem;
}

/**
 * Uses tabs to navigate to the workspace on the test page (i.e. by going
 * through top-level tab stops).
 *
 * @param browser The active WebdriverIO Browser object.
 * @param hasToolbox Whether a toolbox is configured on the test page.
 * @param hasFlyout Whether a flyout is configured on the test page.
 */
export async function tabNavigateToWorkspace(
  browser: WebdriverIO.Browser,
  hasToolbox = true,
  hasFlyout = true,
) {
  // Move focus to initial pre-injection focusable div element.
  //
  // Ideally we'd just reset focus state to the state it is in when
  // the document initially loads (and then send one tab), but alas
  // there's no straightforward way to do that; see
  // https://stackoverflow.com/q/51518855/4969945
  await browser.execute(() => document.getElementById('focusableDiv')?.focus());
  await pause(browser);
  // Navigate to workspace.
  if (hasToolbox) await tabNavigateForward(browser);
  if (hasFlyout) await tabNavigateForward(browser);
  await tabNavigateForward(browser); // Tab to the workspace itself.
}

/**
 * Uses tabs to navigate to the toolbox on the test page (i.e. by going
 * through top-level tab stops). Assumes initial load tab position.
 *
 * @param browser The active WebdriverIO Browser object.
 */
export async function tabNavigateToToolbox(browser: WebdriverIO.Browser) {
  // Initial pre-injection focusable div element.
  await tabNavigateForward(browser);
  // Toolbox.
  await tabNavigateForward(browser);
}

/**
 * Navigates forward to the test page's next tab stop.
 *
 * @param browser The active WebdriverIO Browser object.
 */
export async function tabNavigateForward(browser: WebdriverIO.Browser) {
  await sendKeyAndWait(browser, webdriverio.Key.Tab);
}

/**
 * Navigates backward to the test page's previous tab stop.
 *
 * @param browser The active WebdriverIO Browser object.
 */
export async function tabNavigateBackward(browser: WebdriverIO.Browser) {
  await sendKeyAndWait(browser, [webdriverio.Key.Shift, webdriverio.Key.Tab]);
}

/**
 * Sends the keyboard event for arrow key left.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param times The number of times to repeat the key press (default is 1).
 */
export async function keyLeft(browser: WebdriverIO.Browser, times = 1) {
  await sendKeyAndWait(browser, webdriverio.Key.ArrowLeft, times);
}

/**
 * Sends the keyboard event for arrow key right.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param times The number of times to repeat the key press (default is 1).
 */
export async function keyRight(browser: WebdriverIO.Browser, times = 1) {
  await sendKeyAndWait(browser, webdriverio.Key.ArrowRight, times);
}

/**
 * Sends the keyboard event for arrow key up.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param times The number of times to repeat the key press (default is 1).
 */
export async function keyUp(browser: WebdriverIO.Browser, times = 1) {
  await sendKeyAndWait(browser, webdriverio.Key.ArrowUp, times);
}

/**
 * Sends the keyboard event for arrow key down.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param times The number of times to repeat the key press (default is 1).
 */
export async function keyDown(browser: WebdriverIO.Browser, times = 1) {
  await sendKeyAndWait(browser, webdriverio.Key.ArrowDown, times);
}

/**
 * Sends the specified key(s) for the specified number of times,
 * waiting between each key press to allow changes to keep up.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param keys The WebdriverIO representative key value(s) to press.
 * @param times The number of times to repeat the key press (default 1).
 */
export async function sendKeyAndWait(
  browser: WebdriverIO.Browser,
  keys: string | string[],
  times = 1,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Unintentional comparison error
  if (PAUSE_TIME === 0) {
    // Send all keys in one call if no pauses needed.
    keys = Array(times).fill(keys).flat();
    await browser.keys(keys);
    await pause(browser);
  } else {
    for (let i = 0; i < times; i++) {
      await browser.keys(keys);
      await pause(browser);
    }
  }
}

/**
 * Returns whether there's a drag in progress on the main workspace.
 *
 * @param browser The active WebdriverIO Browser object.
 */
export async function isDragging(
  browser: WebdriverIO.Browser,
): Promise<boolean> {
  return await browser.execute(() => {
    const workspaceSvg = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
    return workspaceSvg.isDragging();
  });
}

/**
 * Returns the result of the specified action precondition.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param action The action to check the precondition for.
 */
export async function checkActionPrecondition(
  browser: WebdriverIO.Browser,
  action: string,
): Promise<boolean> {
  return await browser.execute((action) => {
    const node = Blockly.getFocusManager().getFocusedNode();
    let workspace;
    if (node instanceof Blockly.BlockSvg) {
      workspace = node.workspace as Blockly.WorkspaceSvg;
    } else if (node instanceof Blockly.Workspace) {
      workspace = node as Blockly.WorkspaceSvg;
    } else if (node instanceof Blockly.Field) {
      workspace = node.getSourceBlock()?.workspace as Blockly.WorkspaceSvg;
    }

    if (!workspace) {
      throw new Error('Unable to derive workspace from focused node');
    }
    const actionItem = Blockly.ShortcutRegistry.registry.getRegistry()[action];
    if (!actionItem || !actionItem.preconditionFn) {
      throw new Error(
        `No registered action or missing precondition: ${action}`,
      );
    }
    return actionItem.preconditionFn(workspace, {
      focusedNode: node ?? undefined,
    });
  }, action);
}

/**
 * Wait for the specified context menu item to exist.
 *
 * Does not check the shortcut.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param itemText The display text of the context menu item without shortcut.
 * @param reverse Whether to check for non-existence instead.
 * @return A Promise that resolves when the actions are completed.
 */
export async function contextMenuExists(
  browser: WebdriverIO.Browser,
  itemText: string,
  reverse = false,
): Promise<boolean> {
  // XPath so as not to care if there's a shortcut which adds DOM structure.
  const item = await browser.$(
    `//div[contains(@class, "blocklyMenuItem")]//*[text()="${itemText}"]`,
  );
  return await item.waitForExist({reverse: reverse});
}

/**
 * Wait for the context menu and return a representation of its contents.
 *
 * The text field includes the shortcut if present.
 *
 * @param browser The active WebdriverIO Browser object.
 * @returns The context menu items.
 */
export async function contextMenuItems(browser: WebdriverIO.Browser): Promise<
  Array<{
    text: string;
    disabled?: true;
  }>
> {
  await browser.$('.blocklyContextMenu').waitForExist();
  const items = await browser
    .$$('.blocklyContextMenu .blocklyMenuItem')
    .map(async (item) => {
      const text = await item.getComputedLabel();
      const disabled = (await item.getAttribute('aria-disabled')) === 'true';
      return disabled ? {text, disabled} : {text};
    });
  return items;
}

/**
 * Find a clickable element on the block and click it.
 * We can't always use the block's SVG root because clicking will always happen
 * in the middle of the block's bounds (including children) by default, which
 * causes problems if it has holes (e.g. statement inputs). Instead, this tries
 * to get the first text field on the block. It falls back on the block's SVG root.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param blockId The id of the block to click, as an interactable element.
 * @param clickOptions The options to pass to webdriverio's element.click function.
 * @return A Promise that resolves when the actions are completed.
 */
export async function clickBlock(
  browser: WebdriverIO.Browser,
  blockId: string,
  clickOptions?: Partial<webdriverio.ClickOptions> | undefined,
) {
  const findableId = 'clickTargetElement';
  // In the browser context, find the element that we want and give it a findable ID.
  await browser.execute(
    (blockId, newElemId) => {
      const ws = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
      const block = ws.getBlockById(blockId) as Blockly.BlockSvg;
      // Ensure the block we want to click is within the viewport.
      ws.scrollBoundsIntoView(block.getBoundingRectangleWithoutChildren(), 10);
      if (!block.isCollapsed()) {
        for (const input of block.inputList) {
          for (const field of input.fieldRow) {
            if (field instanceof Blockly.FieldLabel) {
              const svgRoot = field.getSvgRoot();
              if (svgRoot) {
                svgRoot.id = newElemId;
                return;
              }
            }
          }
        }
      }
      // No label field found. Fall back to the block's SVG root.
      block.getSvgRoot().id = newElemId;
    },
    blockId,
    findableId,
  );
  await pause(browser);

  // In the test context, get the WebdriverIO Element that we've identified.
  const elem = await browser.$(`#${findableId}`);

  await elem.click(clickOptions);
  await pause(browser);

  // In the browser context, remove the ID.
  await browser.execute((elemId) => {
    document.getElementById(elemId)?.removeAttribute('id');
  }, findableId);
}

/**
 * Right-clicks on a block with the provided type in the flyout.
 *
 * @param browser The active WebdriverIO Browser object.
 * @param blockType The name of the type block to right click on.
 */
export async function rightClickOnFlyoutBlockType(
  browser: WebdriverIO.Browser,
  blockType: string,
) {
  const elem = await browser.$(`.blocklyFlyout .${blockType}`);
  await elem.click({button: 'right'});
  await pause(browser);
}
