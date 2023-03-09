<script lang="ts">
import Extension from ".";
import {
  ReactiveInvoke,
  reactiveInvoke,
  activeClass,
  color,
} from "$common";
import Snippet from "$common/components/Snippet.svelte";

export let extension: Extension;

const container = activeClass;
</script>

<style>
.container {
  padding: 30px;
  height: 80vh;
  width: 80vw;
  overflow: scroll;
}
</style>

<div class:container>
  <Snippet code={extension.json} copyable={"top"}/>
</div>
