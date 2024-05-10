# extensions/Documentation

This folder contains a custom solution for documentating aspects of the `extensions` codebase. It enables the following:

- Define code snippets as seperate files and reference them in markdown
    - This enables writing automated tests for the code snippets to ensure they stay in sync with the `extensions` API
- Stitch multiple `README.md` files together to create a single, comprehensive `README.md` at [extensions/README.md](../../extensions/README.md)
    - This is convenient to split up large `README.md` files that can be difficult to navigate

## At a Glance

How this works is every folder inside of [extensions/documentation/src](./src/) is expected to have a `README.md` file. When the `generate` command is ran from this package (defined in the [package.json](./package.json)), it will collect all of these `README` files, parse and transform the content according to the constructs ("hooks") defined below, and concatenate them into a single `README.md` file, which is written to [extensions/README.md](../README.md).

This `generate` command is automatically ran on `push` through a [github action](../../.github/workflows/generate-extension-docs.yml).

## Documentation "Hooks"

Below are the 'hooks' that we implement to control the content of the `README.md` files. Each is defined using markdown's [link syntax](https://www.markdownguide.org/basic-syntax/#links) (e.g. `[<link text>](<link url>)`)

### Code Snippet

#### Entire File

Assuming you've defined your code in a file called `index.ts` (which is colocated with your `README.md` file)

**`README.md`**
```
Check out the code below!

[](./index.ts)
```

#### Part of a File

If you only want to render a portion of your code file in the markdown, you must make a few additions to both your code (which assume here to be defined in `index.ts`), and how you reference that code in your `README.md` (by making use of an `export` [URL search parameter](https://support.google.com/google-ads/answer/6277564?hl=en)).

**`index.ts`**
```ts
import { codeSnippet } from "documentation";

export const myCodeSnippet = codeSnippet();

function someFunctionToInclude() {
    // ...
}

myCodeSnippet.end;
```

**`README.md`**
```
Check out the code below (which will only include the lines in between the snippet's declaration and 'myCodeSnippet.end')!

[](./index.ts?export=myCodeSnippet)
```

> **NOTE:** You could've chose any name for the exported variable (instead of `myCodeSnippet`). You just must ensure that you use the correct export in your `README.md`. For example, you'll find a lot of exported codeSnippet's with the name `x` since it's very easy to reference (`[](./index.ts?export=x)`)

#### Testing Code Snippets

### Ordering

By default, all of the `README.md` files are concatenated together in an effectively random order (it's likely alphabetical according to directory name, but this isn't an explicit decision). 

Therefore, we enable you to specify the ordering you'd like for a given piece of documentation by using the following "hook", which **MUST** be defined at the very top of your `README.md`:

```
[](order=<number>)
```

For example:

```
[](order=1)
```

The above will ensure your `README.md` appears first in the generated file (or at least with all of the other `README.md`s with an `order` of `1`).

> NOTE: Decimals are supported, which can enable more fine-grained control. 