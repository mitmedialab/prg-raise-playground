<script lang="ts">
  import Extension, { Emotion, EmotionType } from ".";
  import { ParameterOf, ArgumentEntry, ArgumentEntrySetter } from "$common";

  const emojiImgs: Record<EmotionType, string> = {
    [Emotion.Curious]:
      "https://em-content.zobj.net/thumbs/144/apple/325/face-with-raised-eyebrow_1f928.png",
    [Emotion.Embarassed]:
      "https://em-content.zobj.net/thumbs/144/apple/325/face-with-hand-over-mouth_1f92d.png",
    [Emotion.Frustrated]:
      "https://em-content.zobj.net/thumbs/144/apple/325/confounded-face_1f616.png",
    [Emotion.Happy]:
      "https://em-content.zobj.net/thumbs/144/apple/325/grinning-face_1f600.png",
    [Emotion.Interested]:
      "https://em-content.zobj.net/thumbs/144/apple/325/star-struck_1f929.png",
    [Emotion.Laugh]:
      "https://em-content.zobj.net/thumbs/144/apple/325/face-with-tears-of-joy_1f602.png",
    [Emotion.No]: "https://em-content.zobj.net/thumbs/144/apple/325/thumbs-down_1f44e.png",
    [Emotion.Puzzled]:
      "https://em-content.zobj.net/thumbs/144/apple/325/face-with-diagonal-mouth_1fae4.png",
    [Emotion.Relieved]:
      "https://em-content.zobj.net/thumbs/144/apple/325/relieved-face_1f60c.png",
    [Emotion.Sad]: "https://em-content.zobj.net/thumbs/144/apple/325/slightly-frowning-face_1f641.png",
    [Emotion.SadEyes]:
      "https://em-content.zobj.net/thumbs/144/apple/325/pleading-face_1f97a.png",
    [Emotion.Success]:
      "https://em-content.zobj.net/thumbs/240/apple/325/check-mark-button_2705.png",
    [Emotion.Thinking]:
      "https://em-content.zobj.net/thumbs/144/apple/325/thinking-face_1f914.png",
    [Emotion.Yes]: "https://em-content.zobj.net/thumbs/144/apple/325/thumbs-up_1f44d.png",
  };

  /**
   * Modify this type to match the argument you're developing this UI for.
   * The first parameter is a reference to your extension.
   * The second parameter is the name of the block function this argument belongs to.
   * The third parameter is the index of the argument (i.e. is the functions 2nd argument? Then it's index would be 1)
   */
  type Value = ParameterOf<Extension, "JiboIcon", 0>;

  /**
   * This function can be used to set the value of your custom argument.
   * NOTE: The argument won't actually be updated until the user clicks 'Apply' underneath the UI.
   * If they close the UI without clicking 'Apply', the changes won't persist.
   */
  // svelte-ignore unused-export-let
  export let setter: ArgumentEntrySetter<Value>;

  /**
   * This is the current value of the custom argument at the time of opening this UI.
   * Changing this value will have no effect -- instead use the `setter` function.
   */
  // svelte-ignore unused-export-let
  export let current: ArgumentEntry<Value>;

  /**
   * This is a reference to your extension.
   * It should be treated as 'readonly', meaning you should only pull information FROM your extension to populate this UI.
   * You should NOT use this UI to modify the extension, as that would both confuse the user and anyone developing the extension.
   *
   * If you need a UI to control the extension, instead use the Modal-style UI.
   * @see https://github.com/mitmedialab/prg-extension-boilerplate/tree/dev/extensions#creating-ui-for-extensions
   */
  // svelte-ignore unused-export-let
  export let extension: Extension;

  let value = current.value;
  $: text = Emotion[value];

  $: setter({ value, text });
</script>

<div id="grid">
  {#each Object.keys(Emotion) as emotion}
    <button
      disabled={value == emotion}
      on:click={() => (value = emotion)}
    >
      <div class="cell">
        <img
          class="emoji"
          src={emojiImgs[Emotion[emotion]]}
          alt={Emotion[emotion]}
        />
      </div>
    </button>
  {/each}
</div>

<style>
  /* (A) 5 COLUMNS PER ROW */
  #grid {
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    grid-gap: 10px;
  }
  /* (B) 1 COL ON SMALL SCREENS */
  @media screen and (max-width: 768px) {
    #grid {
      grid-template-columns: auto;
    }
  }
  /* (C) OPTIONAL FOR THE CELLS */
  /* .head {
    font-weight: bold;
    border: 1px solid;
    border-radius: 2px;
  } */
  .emoji {
    width: 50px;
  }
</style>
