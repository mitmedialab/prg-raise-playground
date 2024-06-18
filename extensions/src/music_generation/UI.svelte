<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.58/Tone.js" integrity="sha512-QhmI/idBFIq3hd9NsBFF8y6i5ziFjZP1bea5/J7piTjn6duaZ1LPsFuo26nTXeE1l98vOtXdNkHSzxVDmqVneg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/npm/@magenta/music@1.22.0"></script>
</svelte:head>
<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke, activeClass, color, } from "$common";

  /**
   * @summary This is a reference to the instance of your extension. 
   * @description Use your extension to collect, display, and update information.
   * 
   * In this way, the UI acts as 'view' into your extension and its current state.
   * 
   * Your UI is also able to manipulate your extension's state through interacting with the public properties and functions of your extension
   * (NOTE: functions should not be invoked directly, but instead called through the `invoke` function below).
   */
  // svelte-ignore unused-export-let
  export let extension: Extension;

  /**
   * @summary Use this to close the modal / pop-up that contains this UI.
   * @description This is useful for things like if you have a 'cancel' or 'exit' button within this UI.
   * @example 
   * ```svelte
   * <button on:click={close}>Cancel</button>
   * ```
   */
  // svelte-ignore unused-export-let
  export let close: () => void;
  console.log("extension");
  console.log(extension.userEnteredNotes);

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
  import { onMount } from 'svelte';

    // Define global variables or states if needed
    let melody; // Example global variable

    let toneLoaded = false;
  let magentaLoaded = false;

  // Load Tone.js script
  async function loadToneScript() {
    if (!toneLoaded) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.58/Tone.js');
      toneLoaded = true;
    }
  }

  // Load @magenta/music script
  async function loadMagentaScript() {
    if (!magentaLoaded) {
      await loadScript('https://cdn.jsdelivr.net/npm/@magenta/music@1.22.0');
      magentaLoaded = true;
    }
  }

  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      if (src == "https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.58/Tone.js") {
        script.integrity = "sha512-QhmI/idBFIq3hd9NsBFF8y6i5ziFjZP1bea5/J7piTjn6duaZ1LPsFuo26nTXeE1l98vOtXdNkHSzxVDmqVneg==";
        script.crossOrigin = "anonymous";
        script.referrerPolicy = "no-referrer";
      }
      document.head.appendChild(script);
    });
  }

    // Function to generate melody asynchronously
    async function generateMelody() {
        // Your melody generation logic using Magenta/music
        // Example implementation, adjust as per your actual logic
        const rnn2 = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv');
        await rnn2.initialize();

        const unquantizedSequence = {
            notes: extension.userEnteredNotes,
            totalTime: extension.lastTime,
        };

        const quantizedSequence = mm.sequences.quantizeNoteSequence(unquantizedSequence, 4);

        let progressionArray = extension.userChordProgression.map((chord, index) => ({
            time: index, // Adjust time as needed based on note durations
            text: chord,
            annotationType: 'CHORD_SYMBOL',
        }));

        quantizedSequence.textAnnotations = progressionArray;
        invoke("setSequence", quantizedSequence.notes);
        const continuedSequence = await rnn2.continueSequence(quantizedSequence, 40, 1.0, ['C', 'G', 'Am', 'F']);
        return continuedSequence;
    }

    // Function to play melody
 

    // Execute generateMelody() on component mount
    onMount(async () => {
      await loadToneScript();
      await loadMagentaScript();
        try {
            melody = await generateMelody();
            console.log("Generated Melody:", melody.notes);
            invoke("setNotes", melody.notes);
            close();
        } catch (error) {
            console.error("Error generating melody:", error);
        }
    });
</script>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }
</style>

<div class:container style:width="360px" style:background-color={color.ui.white} style:color={color.text.primary}>
  <p>Generating melody....</p>
</div>