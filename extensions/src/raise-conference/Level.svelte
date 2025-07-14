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
    storyTime: `<h3>Story Time</h3>
    <p>
      Make 2 characters take turns speaking on the stage. <br/>
      Once a character speaks, it should wait for the other character to finish speaking before speaking again.<br/>
      Each character should speak once.<br/>
      You'll see the password once you run the correct code.
    </p>`,
    aliceInWonderland: `
    <h3>Alice in Wonderland</h3>
    <p>
      Make a character grow by 100 in size using a loop.<br /><br />
      <strong>What is a loop?</strong><br />
      Repeat…<br />
      Repeat until…<br />
      Forever…<br /><br />
      You'll see the password after running the correct code and making the sprite increase in size by 100.
    </p>
  `,
    dancingSprite: `
    <h3>Dancing Sprite</h3>
    <p>
      Make a sprite dance forever by switching between two costumes while playing music in a loop.
    </p>
    <p><strong>Hints:</strong><br />
      • Use one stack<br />
      • Make the animation smooth!
    </p>
  `,
    detectSmile: `
    <h3>Detect Smile</h3>
    <p>
      Detect when a user is smiling and have the sprite respond.
      For example, the sprite could say “You have a beautiful smile!”
    </p>
  `,
    followHand: `
    <h3>Follow Hand</h3>
    <p>
      <strong>Part 1:</strong> Use the follow hand part block so that the sprite constantly follows a finger on your hand.
    </p>
    <p>
      <strong>Part 2:</strong> Then, use your finger to drag the sprite to the top right corner of the screen.
    </p>
  `,
    textClassification: `
    <h3>Text Classification</h3>
    <p>
      Ask the user to enter a piece of text. If the sentiment is greater than 0, say something for 2 seconds.
    </p>
    <p><strong>Blocks you might use:</strong><br />
      • "ask … and wait"<br />
      • "answer"
    </p>
  `,
  };

  // ✅ Your Google Drive embed links
  const videoMap: Record<string, string> = {
    storyTime: "https://drive.google.com/file/d/1FP7GdXpQ1sIfInNZvcNJRfU3WOadpA3-/preview",
    aliceInWonderland: "https://drive.google.com/file/d/1yERMmk55-TDH6B6LMN6_qC_yPTQutgY1/preview",
    dancingSprite: "https://drive.google.com/file/d/1uHPLbs6BxmMQ-XZ6YibBmke_ZWyAdq-y/preview",
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
  style:width="500px"
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
