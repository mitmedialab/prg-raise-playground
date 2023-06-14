<script lang="ts">
  import Extension from ".";
  import { activeClass,color } from "$common";
  import Snippet from "$common/components/Snippet.svelte";
  import { extensionDeclarations, filename, fullSuppportName, incrementalSupportName, genericDescriptions, extractPropertiesForGeneric } from "./legacyDocs";

  // svelte-ignore unused-export-let
  export let extension: Extension;
  // svelte-ignore unused-export-let
  export let close: () => void;

  const container = activeClass;

  const importStatement = `import { ${fullSuppportName}, ${incrementalSupportName} } from "./${filename.replace(".ts", "")}";`;
</script>

<style>
.container {
  padding: 30px;
  height: 80vh;
  width: 80vw;
  overflow: scroll;
}

.codelike {
  background-color: black;
  color: rgb(210, 134, 80);
  padding: 3px;
  font-family: monospace;
}
</style>

<div class:container style:background-color={color.ui.white} style:color={color.text.primary}>
  <h3>Next Steps</h3>
  Once you've downloaded the <span class="codelike">{filename}</span> file:
  <ol>
      <li>Move the download into your extension folder so you can use it in your extension's <span class="codelike">index.ts</span> file.</li>
      <li>
          Import the following functions into your <span class="codelike">index.ts</span> file from the downloaded legacy file:
          <Snippet code={importStatement} />
      </li>
      The remaining instructions vary depending on if you're extending the generic Extension base class vs using the onfigurable<span class="codelike">extension()</span> factory function.
      <Snippet code={extensionDeclarations} copyable={false} />
  </ol>

  <h3>Generic Extension</h3>
  <ol>
      <li>
        Extract the necessary properties from {incrementalSupportName}
        <Snippet code={extractPropertiesForGeneric(incrementalSupportName)}/>
      </li>
      <li>  
        Utilize the elements like so:
        <ul>
          {#each Object.entries(genericDescriptions) as [field, {description, snippet}]}
            <li>
              <strong>{field}:</strong> {description}
              {#if snippet}
                <Snippet code={snippet} />
              {/if}
            </li>
          {/each}
        </ul>
      </li>
      <li>
        Once you've implemented all legacy blocks, you can finally replace the usage of {incrementalSupportName} with {fullSuppportName}. 
        If this does not cause type errors, it means you've succesfully implemented all legacy blocks. 
        If you do get errors, there are likely some blocks you still need to implement, or perhaps you have a member that uses a Reserved Name. 
        <Snippet code={extractPropertiesForGeneric(fullSuppportName)}/>
      </li>
  </ol>

  <h3>Configurable Extension</h3>
  TODO
</div>
