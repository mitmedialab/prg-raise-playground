<script lang="ts">
  import { Extension } from "scratch-vm/src/typescript-support/Extension";

  /** CODE GEN GUARDS: Begin Component Import Statements*/
  import type simple from "scratch-vm/src/extensions/typescript_framework_simple/"
  import Something from "scratch-vm/src/extensions/typescript_framework_simple/something.svelte";
  /** CODE GEN GUARDS: End Component Import Statements*/

  export let id: string;
  export let component: string;
  export let name: string;

  export let vm: any;
  export let close: () => void;

</script>

<!-- svelte-ignore missing-declaration -->
{#if id === "typescriptprg95grpframeworkprg95grpsimple" && component === "something"}
  <Something extension={Extension.GetExtensionByID(id)} {close}/>
{/if}
