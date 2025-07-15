<script lang="ts">
  import type Extension from ".";
  import { ReactiveInvoke, reactiveInvoke, activeClass, color } from "$common";

  export let extension: Extension;
  export let close: () => void;

  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) =>
    reactiveInvoke((extension = extension), functionName, args);

  const container = activeClass;

  // ✅ Challenge HTML for each level
  const levelHtmlMap: Record<string, string> = {
    storyTime: `<h3>Challenge 1: Story Time</h3>
    <p>
      Create a scene where two characters (sprites) take turns speaking on the stage.
    </p>
    <p>
      Each character should say something once.
    </p>
    <p>
      When one character speaks, the other should wait until the first finishes.
    </p>
    <p>
      The dialogue should feel like a back-and-forth conversation, not overlapping speech.
    </p>
    <p>
      You'll see the password once you run the correct code.
    </p>
    <p><strong>Note:</strong> You can refer to this information at any time by clicking the "Get Level Information" button in the RAISE Conference extension. Once you solve the challenge and the password shows on the stage, enter the password in the "Go To Next Level!" modal.</p>`,
    aliceInWonderland: `
    <h3>Challenge 2: Growing Alien</h3>
    <p>
      Make a character grow in size by 100 using a loop.
    </p>
    <ul>
      <li>The character should gradually increase in size, not all at once.</li>
      <li>Start from the character's original size and grow until it's 100 units larger.</li>
      <li>Use a loop block.</li>
    </ul>
    <p><strong>Hint: What's a loop block?</strong></p>
    <ul>
      <li>Loops let a block of code run multiple times.</li>
      <li>Examples of loop blocks: repeat, repeat until, or forever.</li>
    </ul>
    <p>
      You'll see the password after running the correct code and making the sprite increase in size by 100.
    </p>
    <p><strong>Note:</strong> You can refer to this information at any time by clicking the "Get Level Information" button in the RAISE Conference extension. Once you solve the challenge and the password shows on the stage, enter the password in the "Go To Next Level!" modal.</p>
  `,
    dancingSprite: `
    <h3>Challenge 3: Dancing Sprite</h3>
    <p>
      Make a sprite dance forever by switching between two costumes and playing music in a loop.
    </p>
    <ul>
      <li>The sprite should alternate between costumes to look like it's dancing.</li>
      <li>The music should keep playing the entire time.</li>
      <li>The animation should look natural, not too fast or jumpy.</li>
    </ul>
    <p><strong>Hint:</strong> Try using a wait block between costume changes to slow down the animation and make the dancing look smoother.</p>
    <p><strong>Note:</strong> You can refer to this information at any time by clicking the "Get Level Information" button in the RAISE Conference extension. Once you solve the challenge and the password shows on the stage, enter the password in the "Go To Next Level!" modal.</p>

  `,
    detectSmile: `
    <h3>Challenge 4: Detect Smile</h3>
    <p>
      Make your sprite recognize when a user is smiling and respond with a message like: "You have a beautiful smile!".
    </p>
    <ul>
      <li>Use the “Face Sensing” extension.</li>
      <li>The sprite should only respond when a smile is detected.</li>
    </ul>
    <p><strong>Hint:</strong> Make sure the sprite is checking for the smile continuously, using a loop or an if block.</p>
    <p><strong>Note:</strong> You can refer to this information at any time by clicking the "Get Level Information" button in the RAISE Conference extension. Once you solve the challenge and the password shows on the stage, enter the password in the "Go To Next Level!" modal.</p>

  `,
    followHand: `
    <h3>Challenge 5: Follow Hand</h3>
    <p>
      Use the extension “Hand Sensing” to make your sprite follow a finger, like your index finger.
    </p>
    <p>
      Now, use your finger to drag the sprite to the top-right corner of the stage.
    </p>
    <p><strong>Note:</strong> You can refer to this information at any time by clicking the "Get Level Information" button in the RAISE Conference extension. Once you solve the challenge and the password shows on the stage, enter the password in the "Go To Next Level!" modal.</p>

  `,
    textClassification: `
    <h3>Challenge 6: Text Classification</h3>
    <p>
      Ask the user to enter a piece of text. If the sentiment is greater than 0, say something for 2 seconds.
    </p>
    <p><strong>Blocks you might use:</strong><br />
      • "ask … and wait"<br />
      • "answer"
    </p>
    <p><strong>Hint:</strong> You can refer to this information at any time by clicking the "Get Level Information" button in the RAISE Conference extension. Once you solve the challenge and the password shows on the stage, enter the password in the "Go To Next Level!" modal.</p>

  `,
  };

  // ✅ Your Google Drive embed links
  const videoMap: Record<string, string> = {
    storyTime: "https://drive.google.com/file/d/1HlZeA3XkrWgYZfPgUPXHLAL3C-mxrKz0/preview",
    aliceInWonderland: "https://drive.google.com/file/d/1xhyPRdNIgaaSH3jeilt313FNpd8594Ah/preview",
    dancingSprite: "https://drive.google.com/file/d/1poAfLvhbLr7u3FZOYFhkJyTRSmf6nZ7v/preview",
    detectSmile: "https://drive.google.com/file/d/1JpNZ_9LPeNN1nzykv0iCmDOeHk5orNQ4/preview",
    followHand: "https://drive.google.com/file/d/1jXBsBHnt03GQL-WUUZqquFAjB-BDj2iD/preview",
    textClassification: "https://drive.google.com/file/d/1MI6lGMnHorL0F0Q-bcHfokuZHvyH8PCC/preview",
  };

  $: currentHtml = levelHtmlMap[extension.level] || "<p>Unknown level</p>";
  $: currentVideo = videoMap[extension.level] || "";
</script>

<style>
  .container {
    text-align: left;
    padding: 30px;
  }

  .video-container {
    margin-top: 20px;
    text-align: center;
  }

  iframe {
    width: 100%;
    height: 200px;
    border: none;
  }

  .button-container {
    text-align: center;
    margin-top: 20px;
  }

  button {
    padding: 8px 16px;
  }
</style>

<div
  class:container
  style:width="700px"
  style:background-color={color.ui.white}
  style:color={color.text.primary}
>
  {@html currentHtml}

  {#if currentVideo}
    <div class="video-container">
      <iframe
        src={currentVideo}
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    </div>
  {/if}

  <div class="button-container">
    <button on:click={close}>Close</button>
  </div>
</div>
