<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import { Extension } from "scratch-vm/src/typescript-support/Extension";

  /** CODE GEN GUARDS: Begin Component Import Statements*/
	import Typescriptprg95grpframeworkprg95grpcomplex_alert from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_complex/alert.svelte";
	import Typescriptprg95grpframeworkprg95grpcomplex_animals from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_complex/animals.svelte";
	import Typescriptprg95grpframeworkprg95grpsimple_counter from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_simple/counter.svelte";
	import Typescriptprg95grpframeworkprg95grpsimple_dummy from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_simple/dummy.svelte";
	import Typescriptprg95grpframeworkprg95grpsimple_palette from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_simple/palette.svelte";
  /** CODE GEN GUARDS: End Component Import Statements*/

  export let id: string;
  export let component: string;
  export let name: string;

  export let vm: any;
  export let close: () => void;

  let target: HTMLDivElement;

  onMount(() => {
    const props = {close, extension: Extension.GetExtensionByID(id)};
    const options = {target, props};
    
    /** CODE GEN GUARDS: Begin Component Construction */
		if (id === "typescriptprg95grpframeworkprg95grpcomplex" && component === "alert") new Typescriptprg95grpframeworkprg95grpcomplex_alert(options);
		if (id === "typescriptprg95grpframeworkprg95grpcomplex" && component === "animals") new Typescriptprg95grpframeworkprg95grpcomplex_animals(options);
		if (id === "typescriptprg95grpframeworkprg95grpsimple" && component === "counter") new Typescriptprg95grpframeworkprg95grpsimple_counter(options);
		if (id === "typescriptprg95grpframeworkprg95grpsimple" && component === "dummy") new Typescriptprg95grpframeworkprg95grpsimple_dummy(options);
		if (id === "typescriptprg95grpframeworkprg95grpsimple" && component === "palette") new Typescriptprg95grpframeworkprg95grpsimple_palette(options);
    /** CODE GEN GUARDS: End Component Construction */
  })

</script>

<div bind:this={target} />