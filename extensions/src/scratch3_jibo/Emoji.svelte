<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke, activeClass, color, } from "../../typescript-support/ui";

  /**
   * @summary This is a reference to the instance of your extension. 
   * @description Use your extension to collect, display, and update information.
   * 
   * In this way, the UI acts as 'view' into your extension and it's current state.
   * 
   * Your UI is also to manipulate that state through interacting with the public properties and functions of your extension
   * (NOTE: functions should not be invoked directly, but instead called through the `invoke` function below).
   */
  export let extension: Extension;

  /**
   * @summary Use this to close the modal / pop-up that contains this UI.
   * @description This is useful for things like if you have a 'cancel' or 'exit' button within this UI.
   * @example 
   * ```svelte
   * <button on:click={close}>Cancel</button>
   * ```
   */
  export let close: () => void;

  /**
   * @summary Use this to invoke functions on your extension.
   * @description Use this function instead of invoking functions on your extension directly,
   * as this ensures your UI will be refreshed after the function is called 
   * (in case any of your extension's properties have changed as a consequence of the function call,
   * which should therefore be updated in the UI).
   * @param functionName Name of the function to invoke
   * @param args Arguments of the specified funtion
   * @example
   * ```ts
   * // do this:
   * invoke("someFunction", 4, "argument 2");
   * // instead of this:
   * extension.someFunction(4, "argument 2");
   * ```
   */
  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) => reactiveInvoke((extension = extension), functionName, args);

  const container = activeClass;

  const emojiIcons = {
    "Airplane": "https://cdn.emojidex.com/emoji/seal/airplane.png?1499688727",
    "Apple": "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f34e.png",
    "Art": "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f3a8.png",
    "Bowling": "https://images.emojiterra.com/google/android-pie/512px/1f3b3.png",
    "Correct": "https://images.emojiterra.com/openmoji/v13.1/512px/2705.png",
    "Exclamation": "https://emojis.wiki/emoji-pics/messenger/exclamation-mark-messenger.png",
    "Football": "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f3c8.png",
    "Heart": "https://images.emojiterra.com/openmoji/v13.1/512px/1f498.png",
    "Magic": "https://images.emojiterra.com/google/android-11/512px/1fa84.png",
    "Ocean": "https://emojipedia-us.s3.amazonaws.com/source/skype/289/water-wave_1f30a.png",
    "Penguin": "https://emojipedia-us.s3.amazonaws.com/source/skype/289/penguin_1f427.png",
    "Rainbow" : "https://emojipedia-us.s3.amazonaws.com/source/skype/289/rainbow_1f308.png",
    "Robot": "https://images.emojiterra.com/google/android-10/512px/1f916.png",
    "Rocket": "https://images.emojiterra.com/openmoji/v13.1/512px/1f680.png",
    "Snowflake": "https://emojipedia-us.s3.amazonaws.com/source/skype/289/snowflake_2744-fe0f.png",
    "Taco": "https://cdn0.iconfinder.com/data/icons/junk-food-emoji-set/100/Taco_2-512.png",
    "Video Game": "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f3ae.png"
  }

  const emojis = ["Airplane", "Apple", "Art", "Bowling", "Correct", "Exclamation", "Football", "Heart", "Magic", "Ocean", "Penguin", "Rainbow", "Robot", "Rocket", "Snowflake", "Taco", "Video Game"]

</script>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }

  /* (A) 5 COLUMNS PER ROW */
  #grid {
    display: grid;
    grid-template-columns: auto auto auto auto auto; 
    grid-gap: 10px;
  }
  /* (B) 1 COL ON SMALL SCREENS */
  @media screen and (max-width:768px) {
    #grid { grid-template-columns: auto; }
  }
  /* (C) OPTIONAL FOR THE CELLS */
  /* .head {
    font-weight: bold;
    border: 1px solid;
    border-radius: 2px;
  } */
  .cell {
    border: 1px solid;
    border-radius: 2px;
  }
  .emoji {
    width: 50px;
  }
</style>

<div class:container style:width=auto style:background-color={color.ui.white} style:color={color.text.primary}>
  <div style:padding='10px'>
    Current Emoji: {extension.emoji}
  </div>
  <div id="grid">
    {#each emojis as e}
    <div class="cell">
      <button style:cursor=pointer on:click={() => {
        extension.emoji = e; 
      }}>
        <img class="emoji" src={emojiIcons[e]} alt={e}/>
      </button>
    </div>
    {/each}
  </div>
</div>

