import { codeSnippet } from "documentation";

export const base = codeSnippet();

import { extension, block, type ExtensionMenuDisplayDetails, type Environment } from "$common";

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

    @block({
      type: "command",
      text: (name, age) => `What's your ${name} and ${age}?`,
      args: [{ type: "string", defaultValue: "name" }, "number"]
    })
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

    @block((self) => ({
      type: "command",
      text: (name, age) => `What's your ${name} and ${age}?`,
      args: [{ type: "string", defaultValue: self.defaultValue }, "number"] as const
    }))
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

    @block({
      type: "command",
      text: (name, age) => `What's your ${name} and ${age}?`,
      args: [{ type: "string", defaultValue: "name" }, "number"]
    })
    someMethodToBlockify(name: string, age: number) {
      this.openUI("someComponent");
    }
  }

  ui.end;
}