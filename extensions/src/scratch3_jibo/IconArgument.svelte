<script lang="ts">
  import Extension, { iconDef, Icon } from ".";
  import { ParameterOf, ArgumentEntry, ArgumentEntrySetter } from "$common";

  const iconImgs: Record<Icon, string> = {
    [Icon.Airplane]: "https://cdn.emojidex.com/emoji/seal/airplane.png?1499688727",
    [Icon.Apple]:
      "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f34e.png",
    [Icon.Art]: "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f3a8.png",
    [Icon.Bowling]: "https://images.emojiterra.com/google/android-pie/512px/1f3b3.png",
    [Icon.Correct]: "https://images.emojiterra.com/openmoji/v13.1/512px/2705.png",
    [Icon.Exclamation]:
      "https://emojis.wiki/emoji-pics/messenger/exclamation-mark-messenger.png",
    [Icon.Football]:
      "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f3c8.png",
    [Icon.Heart]: "https://images.emojiterra.com/openmoji/v13.1/512px/1f498.png",
    [Icon.Magic]: "https://images.emojiterra.com/google/android-11/512px/1fa84.png",
    [Icon.Ocean]:
      "https://emojipedia-us.s3.amazonaws.com/source/skype/289/water-wave_1f30a.png",
    [Icon.Penguin]:
      "https://emojipedia-us.s3.amazonaws.com/source/skype/289/penguin_1f427.png",
    [Icon.Rainbow]:
      "https://emojipedia-us.s3.amazonaws.com/source/skype/289/rainbow_1f308.png",
    [Icon.Robot]: "https://images.emojiterra.com/google/android-10/512px/1f916.png",
    [Icon.Rocket]: "https://images.emojiterra.com/openmoji/v13.1/512px/1f680.png",
    [Icon.Snowflake]:
      "https://emojipedia-us.s3.amazonaws.com/source/skype/289/snowflake_2744-fe0f.png",
    [Icon.Taco]: "https://cdn0.iconfinder.com/data/icons/junk-food-emoji-set/100/Taco_2-512.png",
    [Icon.VideoGame]:
      "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f3ae.png",
  };

  /**
   * Modify this type to match the argument you're developing this UI for.
   * The first parameter is a reference to your extension.
   * The second parameter is the name of the block function this argument belongs to.
   * The third parameter is the index of the argument (i.e. is the functions 2nd argument? Then it's index would be 1)
   */
  type Value = ParameterOf<Extension, "JiboEmoji", 0>;

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
  $: text = iconDef[value].name;

  $: setter({ value, text });
</script>

<div id="grid">
  {#each Object.keys(iconDef) as icon}
    <button 
      disabled={value == parseInt(icon)}
      on:click={() => value = parseInt(icon)}>
      <div class="cell">
        <img class="icon" src={iconImgs[icon]} alt={iconDef[icon].name} />
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
  .icon {
    width: 50px;
  }
</style>
