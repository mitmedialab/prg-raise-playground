export type TimingData = {
  beats: number[],
  crossfade_duration: number
  downbeats: number[],
  loop_duration: number,
  start_time: number,
  buffer: Uint8Array
}

export const getTimingDataFromResponse = async (response: Response) => {
  const arrayBuffer = await response.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  const index = findTextInBuffer(buffer, "GEOB");
  return getTimingDataFromBuffer(buffer, index + 1, 8);
}

const findTextInBuffer = (buffer: Uint8Array, text: string) => {
  for (let i = 0; i < buffer.length - text.length; i++) {
    let match = true;
    for (let j = 0; j < text.length; j++) {
      const c = String.fromCharCode(buffer[i + j]);
      if (c !== text[j]) {
        match = false;
        break;
      }
    }
    if (match) {
      return i;
    }
  }
  return -1;
};

const getTimingDataFromBuffer = (buffer: Uint8Array, start: number, which: number): TimingData => {
  let sectionCount = 0;
  let i;
  for (i = start; i < buffer.length; i++) {
    if (buffer[i] == 0) {
      sectionCount++;
    }
    if (sectionCount >= which) {
      break;
    }
  }
  i++;
  let content = "";
  while (i < buffer.length) {
    if (buffer[i] == 0) {
      break;
    }
    var c = String.fromCharCode(buffer[i]);
    content += c;
    i++;
  }
  try {
    return { ...JSON.parse(content), buffer } as TimingData;
  } catch (e) {
    return undefined;
  }
};