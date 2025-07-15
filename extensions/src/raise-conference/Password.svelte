<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke, activeClass, color } from "$common";

  export let extension: Extension;
  export let close: () => void;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
    reactiveInvoke((extension = extension), functionName, args);

  const container = activeClass;

  // User input
  let levelName = "";
  let password = "";

  // Define levels and correct passwords
  const levelPasswords: Record<string, string> = {
    "storyTime": "growingAlien",
    "growingAlien": "dancingSprite",
    "dancingSprite": "detectSmile",
    "detectSmile": "followHand",
    "followHand": "textClassification",
    "textClassification": "You finished!"
  };

  const levelLinks: Record<string, string> = {
    "storyTime": "https://playground.raise.mit.edu/raise-conference/?level=growingAlien&project=https://www.dropbox.com/scl/fi/ptjjvcqh4hlhgdqfusgrn/growingAlien.sb3?rlkey=vomdmj7y6jnx6vmjc6kc49x8f&st=e3ehc439&dl=0",
    "growingAlien": "https://playground.raise.mit.edu/raise-conference/?level=dancingSprite&project=https://www.dropbox.com/scl/fi/3e2x09nq6at2tsi0vpdmb/ballerina.sb3?rlkey=07pgqu4l5ua04lqe81kgws9no&st=3ph4nusm&dl=0",
    "dancingSprite": "https://playground.raise.mit.edu/raise-conference/?level=detectSmile&project=https://www.dropbox.com/scl/fi/3tudm9qq1spkunk1buc8h/beautifulSmile.sb3?rlkey=3okdy34lxvb662ib4z7ky9hpf&st=dbr9c883&dl=0",
    "detectSmile": "https://playground.raise.mit.edu/raise-conference/?level=followHand&project=https://www.dropbox.com/scl/fi/ez1nd8uwnk9ud5r89v018/followHand.sb3?rlkey=s90ftjlmhnxooytu085dexoxx&st=5biqx8v5&dl=0",
    "followHand": "https://playground.raise.mit.edu/raise-conference/?level=textClassification&project=https://www.dropbox.com/scl/fi/9c09wt5njkph8m1isiw0q/textClassification.sb3?rlkey=tdvme0m8jjcufrbryt4d93bqg&st=yl618j68&dl=0",
    "textClassification": "https://docs.google.com/presentation/d/1ZVHqaSFg3FULKu_EGJWV6364OWtustFg13jYZIZekzQ/edit?usp=sharing"
  };

  $: isPasswordCorrect = levelPasswords[extension.level]?.trim() === password.trim();

  function openNextChallenge() {
    const link = levelLinks[extension.level];
    if (link && isPasswordCorrect) {
      window.open(link, "_blank");
    }
  }
</script>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }

  input {
    display: block;
    margin: 10px auto;
    padding: 8px;
    width: 80%;
  }

  button {
    margin: 10px;
    padding: 10px 20px;
  }

  button:disabled {
    background-color: #ccc;
    color: #777;
    cursor: not-allowed;
  }
</style>

<div class:container style:width="360px" style:background-color={color.ui.white} style:color={color.text.primary}>
  <h2>What's the password???</h2>

  <input
    type="password"
    placeholder="Password"
    bind:value={password}
  />

  <button on:click={openNextChallenge} disabled={!isPasswordCorrect}>
    Open Next Challenge
  </button>
</div>
