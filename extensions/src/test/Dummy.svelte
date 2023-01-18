<script lang="ts">
  import Extension from ".";
  import { activeClass, px, color, ParameterOf } from "$common";
  import { ArgumentEntry, ArgumentEntrySetter } from "$common/customArguments/CustomArgumentManager";

  type Value = ParameterOf<Extension, "test", 0>; 
  
  // svelte-ignore unused-export-let
  export let setter: ArgumentEntrySetter<Value>;

  // svelte-ignore unused-export-let
  export let current: ArgumentEntry<Value>;

  const container = activeClass;

  let {text} = current;

  $: setter({ text, value: {t: text.length.toString()} });
</script>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }
</style>

<div class:container style:background-color={color.ui.white} style:color={color.text.primary}>
  <input bind:value={text}>
</div>