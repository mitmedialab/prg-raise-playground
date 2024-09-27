import { codeSnippet } from "documentation";

export const base = codeSnippet();

import { extension, type ExtensionMenuDisplayDetails, type Environment, scratch } from "$common";

const details: ExtensionMenuDisplayDetails = { name: "" };

const BaseClass = extension(details);

export default class Example extends BaseClass {
  init(env: Environment): void { }
}

base.end;

export const alternative = codeSnippet(); {
  class Example extends extension(details) { // ...
    init(env: Environment): void { alternative.end; }
  }
}

export const updateDetails = codeSnippet(); {

  const details: ExtensionMenuDisplayDetails = {
    name: "An Exciting Extension",
    description: "This is an exciting extension",
    iconURL: "nonStopThrills.png"
  };

  const BaseClass = extension(details);

  class Example extends BaseClass {
    init(env: Environment): void { }
  }

  updateDetails.end;
}

export const method = codeSnippet(); {

  class Example extends BaseClass {
    init(env: Environment): void { }

    someMethodToBlockify(name: string, age: number) {
      console.log(`Hello, ${name}! ${age} is the new ${Math.random() * age * 2}`);
    }
  }

  method.end;
}

export const blockify = codeSnippet(); {

  class Example extends BaseClass {
    init(env: Environment): void { }

    @(scratch.command`What's your ${{ type: "string", defaultValue: "name" }} and ${"number"}?`)
    someMethodToBlockify(name: string, age: number) {
      console.log(`Hello, ${name}! ${age} is the new ${Math.random() * age * 2}`);
    }
  }

  blockify.end;
}

class _BaseClass extends BaseClass {
  init(env: Environment): void { }
}

export const functionArg = codeSnippet(); {
  class Example extends _BaseClass {
    defaultValue = "";

    @(scratch.command((instance, $) => $`What's your ${{ type: "string", defaultValue: instance.defaultValue }} and ${"number"}?`))
    someMethodToBlockify(name: string, age: number) { // ...
      functionArg.end;
    }
  }

  blockify.end;
}

export const ui = codeSnippet(); {

  const BaseClass = extension(details, "ui");

  class Example extends BaseClass {
    init(env: Environment): void { }

    @(scratch.command`What's your ${{ type: "string", defaultValue: "name" }} and ${"number"}?`)
    someMethodToBlockify(name: string, age: number) {
      this.openUI("someComponent");
    }
  }

  ui.end;
}