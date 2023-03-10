import { Environment, extension, ExtensionMenuDisplayDetails, block } from "$common";
import { unzip } from 'unzipit';
//import JSZip from "jszip";

const details: ExtensionMenuDisplayDetails = {
  name: "Project Probe",
  description: "(INTERNAL) An extension for probing the contents of .sb3 files"
};

export default class _ extends extension(details, "ui") {
  projectJson: string;
  currentEntries: Awaited<ReturnType<typeof unzip>>["entries"];

  init(env: Environment): void { }

  @block({
    type: "command",
    arg: "string",
    text: (url) => `Probe & modify project JSON from ${url}`
  })
  async probeProject(url: string) {

    if (url.includes("dropbox.com")) {
      const dropboxRegex = /\/s\/[A-Za-z0-9]+\/.*.sb3/;
      const found = url.match(dropboxRegex);
      if (found.length > 0) url = 'https://dl.dropboxusercontent.com' + found[0];
    }

    const { entries } = await unzip(url);
    const project = entries["project.json"];
    const x = await project.json();
    this.currentEntries = entries;
    this.projectJson = JSON.stringify(x, null, 3);
    this.openUI("JsonView");
  }

  async downloadUpdatedProjectJson(projectJson: string) {
    /*const zip = new JSZip();
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

    saveBlob("Update.sb3", final);*/
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
