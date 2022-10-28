<script lang="ts">
  import { Extension } from "../../../scratch-vm/src/typescript-support/Extension";

  export let id: string;
  export let component: string;
  export let name: string;

  export let vm: any;

</script>

<h1>{id}</h1>
<h1>{name}</h1>
<h1>{component}</h1>