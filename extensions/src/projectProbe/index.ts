import { Environment, extension, ExtensionMenuDisplayDetails, block } from "$common";
import { unzip } from 'unzipit';
// TODO: Investigate why including "jszip" causes the bundle to infinitely keep rebuilding in dev mode
import JSZip from "jszip";

const details: ExtensionMenuDisplayDetails = {
  name: "Project Probe",
  description: "(INTERNAL) An extension for probing the contents of .sb3 files",
  tags: ["PRG Internal"]
};

export default class _ extends extension(details, "ui") {
  projectJson: string;
  currentEntries: Awaited<ReturnType<typeof unzip>>["entries"];

  init(env: Environment): void { }

  @block({
    type: "command",
    text: "Probe & modify a local project"
  })
  async probeLocalProject() {
    const buffer = await openFilePicker();
    this.unzipProject(buffer);
  }

  @block({
    type: "command",
    arg: "string",
    text: (url) => `Probe & modify project JSON from link: ${url}`
  })
  async probeProjectURL(url: string) {

    if (url.includes("dropbox.com")) {
      const dropboxRegex = /\/s\/[A-Za-z0-9]+\/.*.sb3/;
      const found = url.match(dropboxRegex);
      if (found.length > 0) url = 'https://dl.dropboxusercontent.com' + found[0];
    }

    this.unzipProject(url);
  }

  async unzipProject(zip: ArrayBuffer | string) {
    const { entries } = await unzip(zip);
    const project = entries["project.json"];
    const json = await project.json();
    this.currentEntries = entries;
    this.projectJson = JSON.stringify(json, null, 3);
    this.openUI("ProjectView");
  }

  async downloadUpdatedProjectJson(projectJson: string) {
    const zip = new JSZip();
    zip.file('project.json', projectJson);

    for (const key in this.currentEntries) {
      if (key === "project.json") continue;
      const blob = await this.currentEntries[key].blob();
      zip.file(key, blob)
    }

    const final = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/x.scratch.sb3',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6 // Tradeoff between best speed (1) and best compression (9)
      }
    });

    saveBlob("Update.sb3", final);
  }
}

const saveBlob = (filename, blob) => {
  const downloadLink = document.createElement('a');
  document.body.appendChild(downloadLink);

  // Use special ms version if available to get it working on Edge.
  if (navigator["msSaveOrOpenBlob"]) {
    navigator["msSaveOrOpenBlob"](blob, filename);
    return;
  }

  const url = window.URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = filename;
  downloadLink.type = blob.type;
  downloadLink.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(downloadLink);
};

const openFilePicker = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.click();

  return new Promise<ArrayBuffer>((resolve) => {
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = readerEvent => {
        const content = readerEvent.target.result;
        resolve(content as ArrayBuffer);
      }
    }
  })
}
