# Motivation

## Currently, you can make (a lot) of typos

I found the current method for implementing a scratch extension problematic for the following reasons:

- Need to modify multiple files in order to serve your extension. The information you have to provide across these files is vulnerable to typos. 
- The required `getInfo` implementation was vulnerable to typos in several different places:
  - opcodes
  - menus
  - args 
    - Indexing into `args` object passed to opcodes is vulnerable to typos
  - Property names themselves
- Arguments passed to an `opcode` needed to handle casting and expecting 

The majority of the above issues frequently led to runtime erros, which are **time-consuming**, (potentially) **tricky to debug**, and overall **demotivating**. 

## Currently, developing an extension is unapproachable

To develop a scratch extension, you need to keep track of a lot of things:

- Which files to edit
- How to organize your `getInfo` json
- Which arguments you can interact with in an opcode
- What utility functions you have an access to (either through the BlockUtility passed as the second argument to opcodes, your from helper functions in different files)

Programming is hard enough! 

## Currently, there is little control over how people develop their extensions

It is cool that current scratch extension framework is so flexible -- all you need to do is implement/export a class that has a `getInfo` function. 

But this kind of flexibility might make going from _0 to extension_ initimidating, at least the first time you do it. 

Would a more _scafolded_ solution be better? Am I using _scafolded_ correctly? 

Additionally, lots of folks have implemented exciting and helpful new features in the scratch extension ecosystem. It would be a shame for these features to only be used by their original authors, and it'd be worse if they get re-implemented by multiple people in different places.

# How introducing typescript addresses this

Typescript (adding a strongly-typed layer over top of javascript) helps us with most of this, and a (very opinionated<sup>1</sup>) typescript-based framework helps us with the rest.

<sup>1</sup>Opinionated here is meant to indicate that the framework wants you to implement your extension in a certain (and will yell at you, through type errors, if you don't). In return, the framework should allow you to more easily write working extensions. 


# The same extension, 3 different ways

## Js Only

```js
class BarebonesTs {
  getInfo() {
    return {
      id: 'barebonesTs',
      blocks: [{
        opcode: 'log',
        blockType: BlockType.Command,
        text: 'Log [LETTER_NUM] to the console',
        arguments: {
          LETTER_NUM: {
            type: ArgumentType.String,
            defaultValue: 'Hello'
          }
        }
      }]
    }
  }

  log(args) {
    console.log(args.LETTER_NUM);
  }
}
```

Pros:
- Only js

Cons:
- js
- Need to edit multiple files before your extension will show up in the menu and load
- No type safety / typos will prevent your code from working
- No safety around accessing the `args` object

## Ts Only

```ts
class BarebonesTs implements ScratchExtension {
  getInfo(): ExtensionMetadata {
    return {
      id: 'barebonesTs',
      blocks: [{
        opcode: 'log',
        blockType: BlockType.Command,
        text: 'Log [LETTER_NUM] to the console',
        arguments: {
          LETTER_NUM: {
            type: ArgumentType.String,
            defaultValue: 'Hello'
          }
        }
      }]
    }
  }

  log(args) {
    console.log(args.LETTER_NUM);
  }
}
```

Pros:
- By implementing `ScratchExtension` you are required to implement a `getInfo` function that returns an object that adheres to the `ExtensionMetadata`. So it's clearer how to write your `getInfo` function and what it means to implement an extension

Cons: 
- Still need to edit multiple files before your extension will show up in the menu and load
- No typesafety around the `opcode` and `args` (but this could actually be mitigated through some advance typescripting around the `ExtensionMetadata` type -- not fun though)
- No safety around accessing the `args` object

## Ts Extension Framework

```ts
class BarebonesTs extends Extension<{
  title: "Barebones Ts Example",
  description: "Really simple Ts extension",
  iconURL: "something.png",
  insetIconURL: "something.svg"
},
{
  log: (msg: string) => void;
}
> {
  init(env: Environment) { /*do nothing*/  }

  blockBuilders(): Record<"log", BlockBuilder<BlockOperation>> {
    return {
      'log': () => ({
        type: BlockType.Command,
        text: (msg) => `Log ${msg} to the console`,
        operation: (msg) => console.log(msg),
        args: [{type: ArgumentType.String}]
      })
    }
  }

}

export = BarebonesTs;
```

## How to declare menu details

### Allowed

```ts
class GoodInline extends Extension<{
  title: "my_title",
  description: "my_description",
  iconURL: "my_iconURL",
  insetIconURL: "my_insetIconURL",
}, {}>{
  ...
}

```

### Allowed

```ts
type DisplayDetails = {
  title: "my_title",
  description: "my_description",
  iconURL: "my_iconURL",
  insetIconURL: "my_insetIconURL",
}

class GoodInSameFile extends Extension<DisplayDetails, {}>{
  init = notImplemented;
  blockBuilders = notImplemented;
}
```

### NOT Allowed

```ts
type Title = "my_title";
type Description = "my_description";
type IconURL = "my_iconURL";
type InsetIconURL = "my_insetIconURL";

class BadInline extends Extension<{
  title: Title,
  description: Description,
  iconURL: IconURL,
  insetIconURL: InsetIconURL,
}, {}>{
  ...
}
```

### NOT Allowed

```ts
type Title = "test_title";
type Description = "test_description";
type IconURL = "test_iconURL";
type InsetIconURL = "test_insetIconURL";

type DisplayDetails = {
  title: Title,
  description: Description,
  iconURL: IconURL,
  insetIconURL: InsetIconURL,
}

class BadSameFile extends Extension<DisplayDetails, {}>{
  ...
}
```

```ts
type Prefix = "my"

type DisplayDetails = {
  title: `${Prefix}_title`,
  description: `${Prefix}_description`,
  iconURL: `${Prefix}_iconURL`,
  insetIconURL: `${Prefix}_insetIconURL`,
}

class BadInterpolatedStringLiterals extends Extension<DisplayDetails, {}>{
  ...
}
```