<script lang="ts">
  import type Extension from ".";
  import { color, ReactiveInvoke, reactiveInvoke,  } from "$common";

  // svelte-ignore unused-export-let
  export let extension: Extension;

  // svelte-ignore unused-export-let
  export let close: () => void;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) => reactiveInvoke((extension = extension), functionName, args);

  const container = true;

  const form = true;

  let value: string = extension.apiKey;
</script>

<style>
	.form-control{
		margin: .5rem 0;
		text-align: left;
	}

	.input{
		width: 100%;
		display: block;
		padding: 0.5rem 0.5rem;
		margin-top: 0.5rem;
		border-width: 1px;
		border-radius: 0.25rem;
	}

  .container {
    width: 400px;
    padding: 10px;
    background-color: white;
  }

  .form {
    margin-bottom: 30px;
  }

  button {
    outline: none;
    border: none;
    padding: 10px;
    transition: background-color 0.5s ease;
  }

  button:disabled {
    background-color: grey;
  }

  button:hover {
    background-color: rgb(57, 57, 177);
  }
</style>

<div class:container>
  <p class="form-control">
    <label class="label" for="keyInput">OpenAI API Key:</label>
    <input id="keyInput" class="input" bind:value={value}/>
  </p>
  <center class:form>  
    <div>
        <button style:background-color={color.ui.primary} disabled={!value} on:click={() => {
          extension.apiKey = value;
          close();
        }}>Submit</button>
    </div>
  </center>
  <div>
    <div><em><strong>Don't have an OpenAI API?</strong></em></div>
    <div>
      Head <a href="https://beta.openai.com/account/api-keys">here</a> to either login or register, and then create an API key.
    </div>
  </div>
</div>