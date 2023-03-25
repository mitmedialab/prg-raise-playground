<script lang="ts">
  import { onMount } from "svelte";

  export let code: string;
  export let copyable: boolean | "top" = true;
  const clipboard = (text: string) => navigator.clipboard.writeText(text);
  const highlight = () => window["hljs"]?.highlightAll();
  onMount(highlight);
</script>

<style>
  button {
    margin-top: 0px;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/vs2015.min.css" on:load={highlight}>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js" on:load={highlight}/>
</svelte:head>
{#if copyable === "top"}
<center><button on:click={() => clipboard(code)}>Copy Snippet</button></center>
{/if}
<pre><code class="language-typescript">{code}</code></pre>
{#if copyable === true}
<center><button on:click={() => clipboard(code)}>Copy Snippet</button></center>
{/if}

