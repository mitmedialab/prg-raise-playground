/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as chai from 'chai';
import * as Blockly from 'blockly';
import {
  focusOnBlock,
  getCurrentFocusNodeId,
  getFocusedBlockType,
  testSetup,
  focusOnWorkspaceComment,
  sendKeyAndWait,
  testFileLocations,
  keyLeft,
  keyRight,
  keyDown,
  keyUp,
  contextMenuItems,
  PAUSE_TIME,
  checkForFailures,
} from './test_setup.js';
import {Key} from 'webdriverio';

suite('Workspace comment navigation', function () {
  // Disable timeouts when non-zero PAUSE_TIME is used to watch tests run.
  if (PAUSE_TIME) this.timeout(0);

  // Clear the workspace and load start blocks.
  setup(async function () {
    this.browser = await testSetup(
      testFileLocations.NAVIGATION_TEST_BLOCKS,
      this.timeout(),
    );
    [this.commentId1, this.commentId2] = await this.browser.execute(() => {
      const workspace = Blockly.getMainWorkspace();
      const comment1 = Blockly.serialization.workspaceComments.append(
        {
          text: 'Comment one',
          x: 200,
          y: 200,
        },
        workspace,
      );

      const comment2 = Blockly.serialization.workspaceComments.append(
        {
          text: 'Comment two',
          x: 300,
          y: 300,
        },
        workspace,
      );

      return [comment1.id, comment2.id];
    });

    this.getCommentLocation = async (commentId: string) => {
      return this.browser.execute((commentId: string) => {
        const comment = Blockly.getMainWorkspace().getCommentById(commentId);
        if (!comment) return null;
        const bounds = (
          comment as Blockly.comments.RenderedWorkspaceComment
        ).getBoundingRectangle();

        return [bounds.left, bounds.top];
      }, commentId);
    };
  });

  teardown(async function () {
    await checkForFailures(
      this.browser,
      this.currentTest?.title,
      this.currentTest?.state,
    );
  });

  test('Navigate forward from block to workspace comment', async function () {
    await focusOnBlock(this.browser, 'p5_canvas_1');
    await keyDown(this.browser);
    const focusedNodeId = await getCurrentFocusNodeId(this.browser);
    chai.assert.equal(focusedNodeId, this.commentId1);
  });

  test('Navigate forward from workspace comment to block', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId2);
    await keyDown(this.browser);
    const focusedBlock = await getFocusedBlockType(this.browser);
    chai.assert.equal(focusedBlock, 'p5_draw');
  });

  test('Navigate backward from block to workspace comment', async function () {
    await focusOnBlock(this.browser, 'p5_draw_1');
    await keyUp(this.browser);
    const focusedNodeId = await getCurrentFocusNodeId(this.browser);
    chai.assert.equal(focusedNodeId, this.commentId2);
  });

  test('Navigate backward from workspace comment to block', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);
    await keyUp(this.browser);
    const focusedBlock = await getFocusedBlockType(this.browser);
    chai.assert.equal(focusedBlock, 'p5_canvas');
  });

  test('Navigate forward from workspace comment to workspace comment', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);
    await keyDown(this.browser);
    const focusedNodeId = await getCurrentFocusNodeId(this.browser);
    chai.assert.equal(focusedNodeId, this.commentId2);
  });

  test('Navigate backward from workspace comment to workspace comment', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId2);
    await keyUp(this.browser);
    const focusedNodeId = await getCurrentFocusNodeId(this.browser);
    chai.assert.equal(focusedNodeId, this.commentId1);
  });

  test('Navigate forward from workspace comment to workspace comment button', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);
    await keyRight(this.browser);
    const focusedNodeId = await getCurrentFocusNodeId(this.browser);
    chai.assert.equal(focusedNodeId, `${this.commentId1}_collapse_bar_button`);
  });

  test('Navigate backward from workspace comment button to workspace comment', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);
    await keyRight(this.browser);
    await keyLeft(this.browser);
    const focusedNodeId = await getCurrentFocusNodeId(this.browser);
    chai.assert.equal(focusedNodeId, this.commentId1);
  });

  test('Navigate forward from workspace comment button to workspace comment button', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);
    await keyRight(this.browser);
    await keyRight(this.browser);
    const focusedNodeId = await getCurrentFocusNodeId(this.browser);
    chai.assert.equal(focusedNodeId, `${this.commentId1}_delete_bar_button`);
  });

  test('Navigate backward from workspace comment button to workspace comment button', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);
    await keyRight(this.browser);
    await keyRight(this.browser);
    await keyLeft(this.browser);
    const focusedNodeId = await getCurrentFocusNodeId(this.browser);
    chai.assert.equal(focusedNodeId, `${this.commentId1}_collapse_bar_button`);
  });

  test('Activate workspace comment button', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);
    await keyRight(this.browser);
    await sendKeyAndWait(this.browser, Key.Enter);
    const collapsed = await this.browser.execute((commentId) => {
      return Blockly.getMainWorkspace()
        .getCommentById(commentId)
        ?.isCollapsed();
    }, this.commentId1 as string);
    chai.assert.isTrue(collapsed);
  });

  test('Activating workspace comment focuses its editor', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);
    await sendKeyAndWait(this.browser, Key.Enter);
    const focusedNodeId = await getCurrentFocusNodeId(this.browser);
    chai.assert.equal(focusedNodeId, `${this.commentId1}_comment_textarea_`);
  });

  test('Terminating editing commits edits and focuses root workspace comment', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);
    await sendKeyAndWait(this.browser, Key.Enter);
    await sendKeyAndWait(this.browser, 'Hello world');
    await sendKeyAndWait(this.browser, Key.Escape);
    const focusedNodeId = await getCurrentFocusNodeId(this.browser);
    chai.assert.equal(focusedNodeId, `${this.commentId1}`);

    const commentText = await this.browser.execute((commentId) => {
      return Blockly.getMainWorkspace().getCommentById(commentId)?.getText();
    }, this.commentId1 as string);
    chai.assert.equal(commentText, 'Comment oneHello world');
  });

  test('Action menu can be displayed for a workspace comment', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);
    await sendKeyAndWait(this.browser, [Key.Ctrl, Key.Return]);
    chai.assert.deepEqual(
      process.platform === 'darwin'
        ? [
            {'text': 'Duplicate Comment D'},
            {'text': 'Remove Comment'},
            {'text': 'Move Comment M'},
            {'text': 'Cut ⌘ X'},
            {'text': 'Copy ⌘ C'},
            {'disabled': true, 'text': 'Paste ⌘ V'},
          ]
        : [
            {'text': 'Duplicate Comment D'},
            {'text': 'Remove Comment'},
            {'text': 'Move Comment M'},
            {'text': 'Cut Ctrl + X'},
            {'text': 'Copy Ctrl + C'},
            {'disabled': true, 'text': 'Paste Ctrl + V'},
          ],
      await contextMenuItems(this.browser),
    );
  });

  test('Workspace comments can be moved in unconstrained mode', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);

    const initialPosition = await this.getCommentLocation(this.commentId1);
    chai.assert.deepEqual(initialPosition, [200, 200]);

    await sendKeyAndWait(this.browser, 'm');
    await sendKeyAndWait(this.browser, [Key.Alt, Key.ArrowDown], 2);
    await sendKeyAndWait(this.browser, [Key.Alt, Key.ArrowRight]);
    await sendKeyAndWait(this.browser, Key.Enter);

    const newPosition = await this.getCommentLocation(this.commentId1);
    chai.assert.deepEqual(newPosition, [220, 240]);
  });

  test('Workspace comments can be moved in constrained mode', async function () {
    await focusOnWorkspaceComment(this.browser, this.commentId1);

    const initialPosition = await this.getCommentLocation(this.commentId1);
    chai.assert.deepEqual(initialPosition, [200, 200]);

    await sendKeyAndWait(this.browser, 'm');
    await keyUp(this.browser, 2);
    await keyLeft(this.browser);
    await sendKeyAndWait(this.browser, Key.Enter);

    const newPosition = await this.getCommentLocation(this.commentId1);
    chai.assert.deepEqual(newPosition, [180, 160]);
  });
});
