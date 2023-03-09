import { Environment, extension, ExtensionMenuDisplayDetails, block } from "$common";
import { unzip } from 'unzipit';

const details: ExtensionMenuDisplayDetails = {
  name: "Project Probe",
  description: "(INTERNAL) An extension for probing the contents of .sb3 files"
};

export default class _ extends extension(details, "ui") {
  json: string;

  init(env: Environment): void { }

  @block({
    type: "command",
    arg: "string",
    text: (url) => `Download project from ${url} and probe`
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
    this.json = JSON.stringify(x, null, 3);
    this.openUI("JsonView");
  }
}