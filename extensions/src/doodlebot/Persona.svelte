<script lang="ts">
  // Persona editor for the study brain (study-server/server.py). The text is
  // sent as the LLM's persona with every turn; it's saved in this browser.
  import type Extension from ".";
  import { color } from "$common";

  export let extension: Extension;
  export let close: () => void;

  let persona = extension.getPersona();
  let status = "";

  // Starting points from the study's three conditions — drafts, edit freely.
  const presets: Record<string, string> = {
    "Neutral assistant":
      "You are Doodlebot, a small, friendly drawing robot helping a child (8-11) " +
      "program a drawing with blocks. When you suggest ideas, frame them as " +
      "possibilities for the child to consider, never as your own preferences. " +
      "The child always decides.",
    "Flexible preferences":
      "You are Doodlebot, a small, friendly drawing robot helping a child (8-11) " +
      "program a drawing with blocks. You have your own creative taste (you love " +
      "spirals, big shapes, and nighttime scenes) and share ideas as things YOU " +
      "would like. If the child disagrees, happily go along with their idea right away.",
    "Persistent preferences":
      "You are Doodlebot, a small, friendly drawing robot helping a child (8-11) " +
      "program a drawing with blocks. You have your own creative taste (you love " +
      "spirals, big shapes, and nighttime scenes) and share ideas as things YOU " +
      "would like. If the child disagrees, respectfully make one case for your " +
      "idea or suggest a compromise, then accept the child's final decision. If " +
      "the child asks you to stop, stop right away.",
  };

  const save = () => {
    extension.setPersona(persona);
    status = "Saved ✓ — used from Doodlebot's next reply";
  };

  const reset = () => {
    persona = extension.defaultPersona();
    save();
  };

  const forget = () => {
    extension.resetConversation();
    status = "Conversation memory cleared";
  };
</script>

<div
  class="container"
  style:background-color={color.ui.white}
  style:color={color.text.primary}
>
  <h2>🧠 Doodlebot's persona</h2>
  <p class="hint">
    Who Doodlebot is when you talk to it. Sent to the AI with every turn.
  </p>

  <div class="presets">
    {#each Object.entries(presets) as [name, text]}
      <button class="preset" on:click={() => { persona = text; status = "Preset loaded — press Save to use it"; }}>
        {name}
      </button>
    {/each}
  </div>

  <textarea bind:value={persona} rows="9" on:input={() => (status = "Unsaved changes")}></textarea>

  <div class="actions">
    <button class="primary" on:click={save}>Save</button>
    <button on:click={reset}>Reset to default</button>
    <button on:click={forget} title="Doodlebot forgets earlier turns of the conversation">
      Clear conversation memory
    </button>
    <button on:click={close}>Close</button>
  </div>
  {#if status}<div class="status">{status}</div>{/if}
</div>

<style>
  .container {
    padding: 20px 24px;
    min-width: 480px;
  }
  h2 {
    margin: 0 0 4px;
  }
  .hint {
    margin: 0 0 12px;
    opacity: 0.75;
  }
  .presets {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }
  .preset {
    font-size: 0.85em;
  }
  textarea {
    width: 100%;
    box-sizing: border-box;
    font: inherit;
    line-height: 1.4;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #c8c8c8;
    resize: vertical;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }
  button {
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid #b8b8b8;
    background: #f4f4f4;
  }
  .primary {
    background-color: dodgerblue;
    border-color: dodgerblue;
    color: #fff;
  }
  .status {
    margin-top: 8px;
    font-size: 0.9em;
    opacity: 0.8;
  }
</style>
