<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import { Extension } from "scratch-vm/src/typescript-support/Extension";

  /** CODE GEN GUARDS: Begin Component Import Statements*/
	import Typescriptprg95grpframeworkprg95grpcomplex_Alert from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_complex/Alert.svelte";
	import Typescriptprg95grpframeworkprg95grpcomplex_Animals from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_complex/Animals.svelte";
	import Typescriptprg95grpframeworkprg95grpsimple_Counter from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_simple/Counter.svelte";
	import Typescriptprg95grpframeworkprg95grpsimple_Dummy from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_simple/Dummy.svelte";
	import Typescriptprg95grpframeworkprg95grpsimple_Palette from "/Users/parkermalachowsky/MIT/prg-extension-boilerplate/packages/scratch-vm/src/extensions/typescript_framework_simple/Palette.svelte";
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
		if (id === "typescriptprg95grpframeworkprg95grpcomplex" && component === "Alert") new Typescriptprg95grpframeworkprg95grpcomplex_Alert(options);
		if (id === "typescriptprg95grpframeworkprg95grpcomplex" && component === "Animals") new Typescriptprg95grpframeworkprg95grpcomplex_Animals(options);
		if (id === "typescriptprg95grpframeworkprg95grpsimple" && component === "Counter") new Typescriptprg95grpframeworkprg95grpsimple_Counter(options);
		if (id === "typescriptprg95grpframeworkprg95grpsimple" && component === "Dummy") new Typescriptprg95grpframeworkprg95grpsimple_Dummy(options);
		if (id === "typescriptprg95grpframeworkprg95grpsimple" && component === "Palette") new Typescriptprg95grpframeworkprg95grpsimple_Palette(options);
    /** CODE GEN GUARDS: End Component Construction */
  })

</script>

<div bind:this={target} />