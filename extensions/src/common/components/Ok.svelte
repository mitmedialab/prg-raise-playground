<script lang="ts">
  import PrimaryButton from "./PrimaryButton.svelte";
  export let disabled: boolean = false;
</script>

<PrimaryButton on:click {disabled} dataTestID={"ok"}>Ok</PrimaryButton>
