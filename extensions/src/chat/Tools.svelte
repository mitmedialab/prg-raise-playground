<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke, color } from "$common";

  export let extension: Extension;
  export let close: () => void;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
    reactiveInvoke((extension = extension), functionName, args);

  const addTool = async () => {
    // 1. Create a placeholder tool
    // We use a timestamp or random string for 'value' to keep it unique
    const newTool = {
      name: "Tool name",
      description: "Tool description",
    };

    // 2. Tell the backend to add this tool
    // Assuming your extension class has an 'addTool' method
    await invoke("addTool", newTool.name, newTool.description);

    // 3. Trigger Svelte reactivity to show the new row
    extension = extension;
  };

  // Function to handle saving changes on blur (when user clicks away)
  const saveToolEdit = async (tool, index, field, event) => {
    // Get the new value from the editable element

    console.log("NEW TOOL", tool);
    console.log("OLD TOOL", extension.tools);
    const newValue = event.target.innerText.trim();

    await invoke("updateTool", index, field, newValue);

    // 3. Optional: Trigger a UI refresh if needed (e.g., if sorting changes)
    // extension = extension;
  };

  // Prevent 'Enter' key from adding a newline; instead, it triggers blur (saving)
  const handleKeydown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.blur(); // Triggers the saveToolEdit function via blur
    }
  };

  const container = true;
</script>

<div class:container style:background-color={color.ui.white}>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {#each extension.tools as tool, i}
        <tr>
          <td
            contenteditable="true"
            on:blur={(e) => saveToolEdit(tool, i, "name", e)}
            on:keydown={handleKeydown}
          >
            {tool.name}
          </td>

          <td
            contenteditable="true"
            on:blur={(e) => saveToolEdit(tool, i, "description", e)}
            on:keydown={handleKeydown}
          >
            {tool.description || "Enter description..."}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="actions">
    <button class="add-btn" on:click={addTool}>
      <span style:margin-right="5px">+</span> Add Tool
    </button>
  </div>

  <center> </center>
</div>

<style>
  .container {
    width: 360px;
    padding: 10px;
  }
  table {
    width: 100%;
    /* Fixes the width so columns don't jump while typing */
    table-layout: fixed;
    border-collapse: separate; /* Allows for rounded corners on cells */
    border-spacing: 0;
    margin-bottom: 15px;
    font-family: sans-serif;
  }

  th {
    font-weight: 600;
    color: #6b7280; /* Subtle gray */
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 10px 8px;
    text-align: left;
    border-bottom: 2px solid #f3f4f6;
  }

  /* Define column ratios here */
  th:nth-child(1) {
    width: 30%;
  }
  th:nth-child(2) {
    width: 70%;
  }

  td {
    padding: 4px; /* Reduced padding because the editable div adds internal space */
    border-bottom: 1px solid #f3f4f6;
    vertical-align: top;
    /* Prevents content from pushing the table out of its 400px container */
    overflow: hidden;
  }

  /* The actual editable cell */
  td[contenteditable="true"] {
    padding: 8px;
    margin: 2px;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.5;
    color: #374151;
    background-color: transparent;
    transition: all 0.2s ease;
    outline: none;

    /* Ensures text wraps instead of stretching the row horizontally */
    white-space: pre-wrap;
    word-break: break-word;
    min-height: 1.5em;
  }

  /* Hover State */
  td[contenteditable="true"]:hover {
    background-color: #f9fafb;
    cursor: text;
  }

  /* Focus State */
  td[contenteditable="true"]:focus {
    background-color: #fff;
    /* Uses the CSS variable we set on the container */
    box-shadow: 0 0 0 2px var(--focus-color, #007bff);
    position: relative;
    z-index: 10; /* Ensures the focus ring stays above other borders */
  }

  /* Placeholder styling for empty description */
  td[contenteditable="true"]:empty:before {
    content: attr(data-placeholder);
    color: #9ca3af;
    font-style: italic;
  }

  /* Wrapper to center the button below the table */
  .actions {
    display: flex;
    justify-content: center;
    margin-top: 15px;
    padding: 0 10px;
  }

  .add-btn {
    /* Layout & Sizing */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px;

    /* Typography */
    font-size: 14px;
    font-weight: 500;
    color: #666; /* Subtle gray text */

    /* Border & Background */
    background-color: transparent;
    border: 2px dashed #ddd; /* Dashed border indicates an 'Add' placeholder */
    border-radius: 8px;

    /* Interaction */
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  /* Hover state: Uses your CSS variable for the theme color */
  .add-btn:hover {
    color: var(--focus-color, #007bff);
    border-color: var(--focus-color, #007bff);
    background-color: rgba(0, 0, 0, 0.02); /* Very light gray tint */
    transform: translateY(-1px); /* Subtle lift effect */
  }

  /* Active state: When the user actually clicks */
  .add-btn:active {
    transform: translateY(0);
    background-color: rgba(0, 0, 0, 0.05);
  }

  /* Styling the '+' span specifically */
  .add-btn span {
    font-size: 18px;
    line-height: 0;
    margin-bottom: 2px; /* Visual alignment for the '+' sign */
  }
</style>
