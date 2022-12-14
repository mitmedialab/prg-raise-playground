<script lang="ts" context="module">
  type ExtensionID = string;
  type ComponentName = string;

  type Payload = {
    target: HTMLDivElement;
    props: { close: () => void, extension: Extension<any, any> };
  }


  type UIConstructor = (details: Payload) => void; 
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import type ExtensionManager from 'scratch-vm/src/extension-support/extension-manager';
  import { Extension } from "scratch-vm/src/typescript-support/Extension";

  /** CODE GEN GUARDS: Begin Component Import Statements*/
	import Typescriptprg95grpframeworkprg95grpcomplex_Alert from "scratch-vm/src/extensions/typescript_framework_complex/Alert.svelte";
	import Typescriptprg95grpframeworkprg95grpcomplex_Animals from "scratch-vm/src/extensions/typescript_framework_complex/Animals.svelte";
	import Typescriptprg95grpframeworkprg95grpsimple_Counter from "scratch-vm/src/extensions/typescript_framework_simple/Counter.svelte";
	import Typescriptprg95grpframeworkprg95grpsimple_Dummy from "scratch-vm/src/extensions/typescript_framework_simple/Dummy.svelte";
	import Typescriptprg95grpframeworkprg95grpsimple_Palette from "scratch-vm/src/extensions/typescript_framework_simple/Palette.svelte";
  /** CODE GEN GUARDS: End Component Import Statements*/


  export let id: ExtensionID;
  export let component: ComponentName;
  export let name: string;

  export let vm: { extensionManager: ExtensionManager & {getAuxiliaryObjectConstructor: (id: ExtensionID, name: ComponentName) => UIConstructor } };
  export let close: () => void;

  let target: HTMLDivElement;

  onMount(async () => {
    const props = {close, extension: Extension.GetExtensionByID(id)};
    const options = {target, props};

    if (id === "test") {
      vm.extensionManager.getAuxiliaryObjectConstructor(id, component)(options);
      return;
    }
    
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