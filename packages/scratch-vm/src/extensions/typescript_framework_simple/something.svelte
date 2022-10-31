<script lang="ts">
  import Extension from ".";
  import { invokeFromUI, type InvokeFromUI } from "../../typescript-support/ui";
  export let extension: Extension;

  const invoke: InvokeFromUI<Extension> = (funcName, ...args) => {
    extension = extension;
    return invokeFromUI(extension, funcName, args);
  }

</script>

<div>
  Yayyyyy {extension.count}

  <button on:click={() => invoke("increment")}>
    Plus 1
  </button>

  <button on:click={() => invoke("incrementBy", 3)}>
    Plus 3
  </button>
</div>