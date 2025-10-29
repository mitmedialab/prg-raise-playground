import { scratch, extension, type ExtensionMenuDisplayDetails, type BlockUtilityWithID, type Environment, block } from "$common";

/** 👋 Hi!

Below is a working Extension that you should adapt to fit your needs. 

It makes use of JSDoc comments (anything inside of the '/**   * /' regions) 
to add explanations to what you're seeing. These do not affect the code 
and can be deleted whenever you no longer need them.

Anywhere you find something that looks like: @see {ExplanationOfSomething} 
hover over the 'ExplanationOfSomething' part (the text inside of the {...} curly brackets) 
to get a popup that tells you more about that concept.

Try out hovering by reviewing the below terminology.
NOTE: When the documentation refers to these terms, they will be capitalized.

@see {Extension}
@see {Block}
@see {BlockProgrammingEnvironment}

If you don't see anything when hovering, or find some documentation is missing, please contact: 
Parker Malachowsky (pmalacho@media.mit.edu)

Happy coding! 👋 */

/** @see {ExplanationOfDetails} */
const details: ExtensionMenuDisplayDetails = {
  name: "Chat Extension",
  description: "Replace me with a description of your extension",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

/** @see {ExplanationOfClass} */
export default class ExtensionNameGoesHere extends extension(details) {

  voice_id: number;
  pitch_value: number;

  /** @see {ExplanationOfInitMethod} */
  init(env: Environment) {
    this.exampleField = 0;
    this.voice_id = 1;
    this.pitch_value = 0;
  }

  /** @see {ExplanationOfField} */
  exampleField: number;

  /** @see {ExplanationOfExampleReporter}*/
  // @(scratch.reporter`This is the block's display text (so replace me with what you want the block to say)`)
  // exampleReporter() {
  //   return ++this.exampleField;
  // }

  // /** @see {ExplanationOfReporterWithArguments}*/
  // @(scratch.reporter`This is the block's display text with inputs here --> ${"string"} and here --> ${{ type: "number", defaultValue: 1 }}`)
  // reporterThatTakesTwoArguments(exampleString: string, exampleNumber: number) {
  //   return exampleString + exampleNumber;
  // }

  // /** @see {ExplanationOfExampleCommand} */
  // @(scratch.command`This is the block's display text`)
  // exampleCommand() {
  //   alert("This is a command!");
  // }

  // /** @see {ExplanationOfCommandWithExtendDefinition} */
  // @(scratch.command((instance, tag) => {
  //   console.log("Creating a block for extension: ", instance.id);
  //   return tag`This is the block's display text`;
  // }))
  // exampleCommandWithExtendedDefinition() {
  //   alert("This is a command defined using the extended definition strategy!");
  // }

  // /** @see {ExplanationOfExampleHatAndBlockUtility} */
  // @(scratch.hat`Should the below block execute: ${"Boolean"}`)
  // async exampleHatThatUsesBlockUtility(condition: boolean, util: BlockUtilityWithID) {
  //   return util.stackFrame.isLoop === condition;
  // }

  async recordMicrophoneAudio(seconds: number): Promise<Float32Array> {
    // Ask for microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
    // Create MediaRecorder
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
  
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
  
    // Start recording
    recorder.start();
  
    // Stop after given seconds
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    recorder.stop();
  
    // Wait until the recorder finishes
    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });
  
    // Stop the stream tracks
    stream.getTracks().forEach((t) => t.stop());
  
    // Combine chunks into a single Blob
    const blob = new Blob(chunks, { type: "audio/webm" });
    const arrayBuffer = await blob.arrayBuffer();
  
    // Decode into Float32 PCM data
    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  
    // Flatten all channels into one Float32Array (mono)
    const channelData = audioBuffer.getChannelData(0);
    return new Float32Array(channelData);
  }
  
  

  async saveAudioBufferToWav(buffer) {
    function createWavHeader(buffer) {
      const numChannels = buffer.numberOfChannels;
      const sampleRate = buffer.sampleRate;
      const bitsPerSample = 16; // 16-bit PCM
      const blockAlign = (numChannels * bitsPerSample) / 8;
      const byteRate = sampleRate * blockAlign;
      const dataLength = buffer.length * numChannels * 2; // 16-bit PCM = 2 bytes per sample
      const header = new ArrayBuffer(44);
      const view = new DataView(header);
      // "RIFF" chunk descriptor
      writeString(view, 0, "RIFF");
      view.setUint32(4, 36 + dataLength, true); // File size - 8 bytes
      writeString(view, 8, "WAVE");
      // "fmt " sub-chunk
      writeString(view, 12, "fmt ");
      view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
      view.setUint16(20, 1, true); // Audio format (1 = PCM)
      view.setUint16(22, numChannels, true); // Number of channels
      view.setUint32(24, sampleRate, true); // Sample rate
      view.setUint32(28, byteRate, true); // Byte rate
      view.setUint16(32, blockAlign, true); // Block align
      view.setUint16(34, bitsPerSample, true); // Bits per sample
      // "data" sub-chunk
      writeString(view, 36, "data");
      view.setUint32(40, dataLength, true); // Data length
      console.log("WAV Header:", new Uint8Array(header));
      return header;
    }
    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }
    function interleave(buffer) {
      const numChannels = buffer.numberOfChannels;
      const length = buffer.length * numChannels;
      const result = new Float32Array(length);
      const channelData = [];
      for (let i = 0; i < numChannels; i++) {
        channelData.push(buffer.getChannelData(i));
      }
      let index = 0;
      for (let i = 0; i < buffer.length; i++) {
        for (let j = 0; j < numChannels; j++) {
          result[index++] = channelData[j][i];
        }
      }
      console.log("Interleaved data:", result);
      return result;
    }
    function floatTo16BitPCM(output, offset, input) {
      for (let i = 0; i < input.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i])); // Clamp to [-1, 1]
        s = s < 0 ? s * 0x8000 : s * 0x7FFF; // Convert to 16-bit PCM
        output.setInt16(offset, s, true); // Little-endian
      }
    }
    const header = createWavHeader(buffer);
    const interleaved = interleave(buffer);
    const wavBuffer = new ArrayBuffer(header.byteLength + interleaved.length * 2);
    const view = new DataView(wavBuffer);
    //return this.createAndSaveWAV(interleaved, buffer.sampleRate);
    // Write header
    new Uint8Array(wavBuffer).set(new Uint8Array(header), 0);
    // Write PCM data
    floatTo16BitPCM(view, header.byteLength, interleaved);
    console.log("Final WAV buffer length:", wavBuffer.byteLength);
    console.log("Expected data length:", header.byteLength + interleaved.length * 2);
    // Return a Blob
    return new Blob([wavBuffer], { type: "audio/wav" });
  }

  writeString(view: DataView, offset: number, text: string) {
    for (let i = 0; i < text.length; i++) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  }

  generateWAV(interleaved: Float32Array, sampleRate: number): Uint8Array {
    const numChannels = 1; // Mono
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataLength = interleaved.length * (bitsPerSample / 8);
    const bufferLength = 44 + dataLength;
    const buffer = new ArrayBuffer(bufferLength);
    const view = new DataView(buffer);
    // RIFF header
    this.writeString(view, 0, "RIFF");
    view.setUint32(4, bufferLength - 8, true); // File size
    this.writeString(view, 8, "WAVE");
    // fmt subchunk
    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true); // Channels
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, byteRate, true); // Byte rate
    view.setUint16(32, blockAlign, true); // Block align
    view.setUint16(34, bitsPerSample, true); // Bits per sample
    // data subchunk
    this.writeString(view, 36, "data");
    view.setUint32(40, dataLength, true);
    // PCM data
    const offset = 44;
    for (let i = 0; i < interleaved.length; i++) {
      const sample = Math.max(-1, Math.min(1, interleaved[i]));
      view.setInt16(offset + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }
    return new Uint8Array(buffer);
  }

  createAndSaveWAV(interleaved, sampleRate) {
    // Step 1: Get interleaved audio data and sample rate
    // Step 2: Generate WAV file
    const wavData = this.generateWAV(interleaved, sampleRate);
    // Step 3: Save or process the WAV file
    // Example: Create a Blob and download the file
    const blob = new Blob([wavData], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    // Create a link to download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.wav";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return blob;
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // "data:<mime>;base64,<base64>"
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }


  async sendAudioFileToChatEndpoint(file, endpoint, blob, seconds) {
    console.log("sending audio file");
    const url = `https://doodlebot.media.mit.edu/${endpoint}?voice=${this.voice_id}&pitch=${this.pitch_value}`
    const formData = new FormData();
    formData.append("audio_file", file);
    const audioURL = URL.createObjectURL(file);
    const audio = new Audio(audioURL);
    //audio.play();

    try {
      let response;
      let uint8array;

      response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const textResponse = response.headers.get("text-response");
      console.log("Text Response:", textResponse);

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      console.log("Audio URL:", audioUrl);

      const audio = new Audio(audioUrl);
      audio.play();



    } catch (error) {
      console.error("Error sending audio file:", error);
    }
  }
  async isValidWavFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const dataView = new DataView(arrayBuffer);

    // Check the "RIFF" chunk descriptor
    const riff = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(0, 4)));
    if (riff !== "RIFF") {
      console.error("Invalid WAV file: Missing RIFF header");
      return false;
    }

    // Check the "WAVE" format
    const wave = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(8, 12)));
    if (wave !== "WAVE") {
      console.error("Invalid WAV file: Missing WAVE format");
      return false;
    }

    // Check for "fmt " subchunk
    const fmt = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(12, 16)));
    if (fmt !== "fmt ") {
      console.error("Invalid WAV file: Missing fmt subchunk");
      return false;
    }

    // Check for "data" subchunk
    const dataIndex = arrayBuffer.byteLength - 8; // Approximate location
    const dataChunk = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(dataIndex, dataIndex + 4)));
    if (dataChunk !== "data") {
      console.error("Invalid WAV file: Missing data subchunk");
      return false;
    }

    console.log("Valid WAV file");
    return true;
  }
  

  async processAndSendAudio(float32Buffer: Float32Array, endpoint: string, seconds: number) {
    try {
      // 1️⃣ Create AudioContext and AudioBuffer
      const audioCtx = new AudioContext();
      const audioBuffer = audioCtx.createBuffer(
        1, // mono
        float32Buffer.length,
        audioCtx.sampleRate
      );
      audioBuffer.copyToChannel(float32Buffer, 0);
  
      // 2️⃣ Encode AudioBuffer to WAV
      const wavBlob = await this.saveAudioBufferToWav(audioBuffer); // now works
  
      // 3️⃣ Create a playable file
      const wavFile = new File([wavBlob], "output.wav", { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(wavFile);
  
      // 4️⃣ Play the WAV
      const audio = new Audio(audioUrl);
      audio.play();
      await new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
      });
  
      // 5️⃣ Send WAV to server
      await this.sendAudioFileToChatEndpoint(wavFile, endpoint, wavBlob, seconds);
  
    } catch (error) {
      console.error("Error processing and sending audio:", error);
    }
  }
  

  private async handleChatInteraction(seconds: number, endpoint: string) {
    console.log(`recording audio for ${seconds} seconds`);

    console.log("recording audio?")
    const buffer = await this.recordMicrophoneAudio(seconds);
    console.log("finished recording audio");

    const audioCtx = new AudioContext();
  const audioBuffer = audioCtx.createBuffer(1, buffer.length, audioCtx.sampleRate);
  audioBuffer.copyToChannel(buffer, 0);

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start();

  // ⏳ Optionally wait for playback to finish
  await new Promise((resolve) => {
    source.onended = resolve;
  });

  console.log("playback finished, now sending to server...");


    await this.processAndSendAudio(buffer, endpoint, seconds);


  }

  private async speakText(text: string, showDisplay: boolean = false) {
    try {

      const url = `https://doodlebot.media.mit.edu/speak?voice=${this.voice_id}&pitch=${this.pitch_value}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      await new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
          resolve(null);
        });
      });

      audio.play();


    } catch (error) {
      console.error("Error in speak function:", error);

      throw error; // Re-throw the error so calling functions can handle it
    }
  }









  @block({
    type: "command",
    text: (seconds) => `chat with me for ${seconds} seconds`,
    arg: { type: "number", defaultValue: 3 }
  })
  async testChatAPI(seconds: number) {
    await this.handleChatInteraction(seconds, "chat");
  }

  @block({
    type: "command",
    text: (seconds) => `repeat after me for ${seconds} seconds`,
    arg: { type: "number", defaultValue: 3 }
  })
  async testRepeatAPI(seconds: number) {
    await this.handleChatInteraction(seconds, "repeat_after_me");
  }

  @block({
    type: "command",
    text: (text) => `speak ${text}`,
    arg: { type: "string", defaultValue: "Hello!" }
  })
  async speak(text: string, utility: BlockUtilityWithID) {
    await this.speakText(text);
  }

  @block({
    type: "command",
    text: (voice, pitch) => `set voice to ${voice} and pitch to ${pitch}`,
    args: [
      { type: "number", defaultValue: 1 },
      { type: "number", defaultValue: 0 }
    ]
  })
  async setVoiceAndPitch(voice: number, pitch: number) {
    this.voice_id = voice;
    this.pitch_value = pitch;
  }
}