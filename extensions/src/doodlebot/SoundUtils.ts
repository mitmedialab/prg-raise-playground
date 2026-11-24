export const writeString = (view: DataView, offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  }

export const saveAudioBufferToWav = async (buffer) => {
    function createWavHeader(buffer) {
      const numChannels = buffer.numberOfChannels;
      const sampleRate = buffer.sampleRate / 4;
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

  export const generateWAV = (interleaved: Float32Array, sampleRate: number): Uint8Array => {
    const numChannels = 1; // Mono
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataLength = interleaved.length * (bitsPerSample / 8);
    const bufferLength = 44 + dataLength;
    const buffer = new ArrayBuffer(bufferLength);
    const view = new DataView(buffer);
    // RIFF header
    writeString(view, 0, "RIFF");
    view.setUint32(4, bufferLength - 8, true); // File size
    writeString(view, 8, "WAVE");
    // fmt subchunk
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // Subchunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true); // Channels
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, byteRate, true); // Byte rate
    view.setUint16(32, blockAlign, true); // Block align
    view.setUint16(34, bitsPerSample, true); // Bits per sample
    // data subchunk
    writeString(view, 36, "data");
    view.setUint32(40, dataLength, true);
    // PCM data
    const offset = 44;
    for (let i = 0; i < interleaved.length; i++) {
      const sample = Math.max(-1, Math.min(1, interleaved[i]));
      view.setInt16(offset + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }
    return new Uint8Array(buffer);
  }

  export const createAndSaveWAV = (interleaved, sampleRate) => {
    // Step 1: Get interleaved audio data and sample rate
    // Step 2: Generate WAV file
    const wavData = generateWAV(interleaved, sampleRate);
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

  export const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // "data:<mime>;base64,<base64>"
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

export const  isValidWavFile = async (file) => {
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