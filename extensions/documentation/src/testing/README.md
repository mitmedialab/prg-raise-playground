[](order=1)
## Testing Extensions

Writing tests is an important part of creating maintainable software.

In addition to identifying bugs during an initial implementation or after a refactor, tests can serve to document your code and demonstrate its usage.

### Learning by example

The below examples will test the below extension:

[](./index.ts?export=defineExtension)

<details>
<summary>To save space, the block definitions are hidden, but you can open this if you need to see them:</summary>

[](./index.ts?export=defineBlocks)

</details>

### Anatomy of a test

Extension test suites will make use of the `createTestSuite` utility function implemented in [extensions/testing/index.ts]() (available under the alias `$testing`).

[](./index.test.ts?export=fileStructure)

As is clear from the second argument of the createTestSuite function, there are two different types of tests:
  - [Unit Tests](#unit-tests)
  - [Integration Tests](#unit-tests)

### Unit Tests

Specifically for extensions, [unit tests](https://en.wikipedia.org/wiki/Unit_testing) test the operation of a single block.

A unit test for a block is defined as an entry in the unitTests object whose key is the name of the block (as defined in the second generic parameter of the Extension class -- for example, this means either `exampleReporter`, `exampleCommand`, or `exampleButtonThatOpensUI`).

The values will either be (1) an object of a certain type, (2) a function that returns an object of that certain type, or (3) an array of either. The object type can have the keys outlined below:

#### Simple Example

[](./index.test.ts?export=simpleExample)

#### Complex Example

[](./index.test.ts?export=complexExample)

#### Testing UI

It is also possible to test the creation of UI (say if your block executes the `openUI` Extension function).

See the below example:

[](./index.test.ts?export=ui)

<details>
<summary>Open this if you'd like to see the UI (Svelte) component beind tested (it's not very exciting)</summary>

[](./Test.svelte)

</details>

The `ui` object you can interact with within this test is based on the [Testing Library](https://testing-library.com/);

See [their documentation](https://testing-library.com/docs/) for a complete guide on how to [query for elements](https://testing-library.com/docs/queries/about) and [interact with them](https://testing-library.com/docs/dom-testing-library/api-events).

### Integration Test

Specifically for extensions, [integration tests]() test either the operations of multiple blocks or how one extension interacts with another.

They are implemented as functions as you can see below:

[](./index.test.ts?export=integration)