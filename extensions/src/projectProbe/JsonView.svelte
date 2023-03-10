<script lang="ts">
import Extension from ".";
import {activeClass} from "$common";
import Snippet from "$common/components/Snippet.svelte";

export let extension: Extension;

const container = activeClass;
let code = extension.projectJson;

$: lines = code.split("\n");

let find: string;
let replace: string;

$: matches = find ? lines.map(line => Array.from(line.matchAll(new RegExp(find, "g")))).flat() : undefined;
$: matchLines =  find ? lines.filter(line => Array.from(line.matchAll(new RegExp(find, "g"))).length > 0): undefined;
$: numMatches = matches?.length;

</script>

<style>
.container {
  padding: 30px;
  height: 80vh;
  width: 80vw;
  overflow: scroll;
}
.matches {
  background-color: white;
}

.find {
  background-color: yellow;
  display: inline-block;
}

.replace {
  background-color: rgb(168, 80, 186);
  font-style: italic;
  display: inline-block;
}
</style>

<div class:container>
  <div>
    Find: <input bind:value={find} /> 
    Replace: <input bind:value={replace} /> 
    <button on:click={() => code = lines.map(line => line.replaceAll(new RegExp(find, "g"), replace)).join("\n")}>execute</button>
  </div>
  <div>
    <i>{numMatches} matches</i>
  </div>
  <div class="matches">
    {#if matches}
      {#each matchLines as match}
        <div>
          {#if replace}
            {#each match.split(find) as segment, index}
                {segment}{#if index < match.split(find).length - 1}<div class="replace">{replace}</div>{/if}
            {/each}
          {:else}
            {#each match.split(find) as segment, index}
              {segment}{#if index < match.split(find).length - 1}<div class="find">{find}</div>{/if}
            {/each}
          {/if}
        </div>
      {/each}
    {/if}
  </div>
  <div>
  <center>
    <button on:click={() => extension.downloadUpdatedProjectJson(code)}>
      Download Updated Project
    </button>
  </center>
  </div>
  <Snippet {code} copyable={"top"}/>
</div>
