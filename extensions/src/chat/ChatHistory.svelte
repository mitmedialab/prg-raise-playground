<script lang="ts">
  import type Extension from ".";
  import { color } from "$common";

  export let extension: Extension;
  export let close: () => void;

  const container = true;
</script>

<div
  class:container
  style:background-color={color.ui.white}
  style:--user-bg={color.ui.blue || "#007bff"}
>
  <header class="header">
    <strong>Session History</strong>
  </header>

  <div class="history-viewport">
    {#if extension.displayChatHistory && extension.displayChatHistory.length > 0}
      {#each extension.displayChatHistory as chat}
        {#if chat.role === "tool"}
          <div class="tool-log">
            <span class="role-label">System Action</span>
            <code>
              {`Calling: ${chat.content}`}
            </code>
          </div>
        {:else}
          <div
            class="message {chat.role === 'student' || chat.role === 'user'
              ? 'student'
              : 'chatgpt'}"
          >
            <span class="role-label">
              {chat.role === "student" || chat.role === "user"
                ? "Student"
                : "ChatGPT"}
            </span>
            {chat.content || ""}
          </div>
        {/if}
      {/each}
    {:else}
      <div class="empty-state">
        <p>No messages in this session yet.</p>
      </div>
    {/if}
  </div>

  <footer class="footer">
    <button on:click={close}>Close</button>
  </footer>
</div>

<style>
  .container {
    width: 400px;
    height: 500px;
    display: flex;
    flex-direction: column;
    padding: 15px;
    font-family: sans-serif;
  }

  .header {
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    font-size: 16px;
  }

  .history-viewport {
    flex: 1;
    overflow-y: auto;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .message {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 15px;
    font-size: 14px;
    line-height: 1.4;
  }

  .student {
    align-self: flex-end;
    background-color: var(--user-bg, #007bff);
    color: white;
    border-bottom-right-radius: 2px;
  }

  .chatgpt {
    align-self: flex-start;
    background-color: #f0f0f0;
    color: #333;
    border-bottom-left-radius: 2px;
    border: 1px solid #e0e0e0;
  }

  /* Role 3: Tool Styles */
  .tool-log {
    align-self: center;
    width: 90%;
    background-color: #fcfcfc;
    border: 1px dashed #ccc;
    padding: 8px;
    border-radius: 6px;
    text-align: center;
  }

  code {
    font-family: monospace;
    font-size: 11px;
    color: #666;
    display: block;
    word-break: break-all;
  }

  .role-label {
    font-size: 10px;
    text-transform: uppercase;
    margin-bottom: 4px;
    opacity: 0.7;
    display: block;
  }

  .footer {
    margin-top: 15px;
    text-align: right;
  }

  button {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
  }

  .empty-state {
    text-align: center;
    color: #999;
    margin-top: 50px;
  }

  .history-viewport::-webkit-scrollbar {
    width: 6px;
  }
  .history-viewport::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
</style>
