<script lang="ts">
  import { Extension } from "scratch-vm/src/typescript-support/Extension";

  /** CODE GEN GUARDS: Begin Component Import Statements*/
	import type typescriptprg95grpframeworkprg95grpcomplex from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_complex/";
	import Typescriptprg95grpframeworkprg95grpcomplex_animals from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_complex/animals.svelte";
	import type typescriptprg95grpframeworkprg95grpsimple from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_simple/";
	import Typescriptprg95grpframeworkprg95grpsimple_dummy from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_simple/dummy.svelte";
  /** CODE GEN GUARDS: End Component Import Statements*/

  export let id: string;
  export let component: string;
  export let name: string;

  export let vm: any;
  export let close: () => void;

</script>

<!-- CODE GEN GUARDS: Begin Component Markup -->
{#if id === "typescriptprg95grpframeworkprg95grpcomplex" && component === "animals"}
<Typescriptprg95grpframeworkprg95grpcomplex_animals extension={Extension.GetExtensionByID("typescriptprg95grpframeworkprg95grpcomplex")} {close}/>
{/if}
{#if id === "typescriptprg95grpframeworkprg95grpsimple" && component === "dummy"}
<Typescriptprg95grpframeworkprg95grpsimple_dummy extension={Extension.GetExtensionByID("typescriptprg95grpframeworkprg95grpsimple")} {close}/>
{/if}
<!-- CODE GEN GUARDS: End Component Markup -->
