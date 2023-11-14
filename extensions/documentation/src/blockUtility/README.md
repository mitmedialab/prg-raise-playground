## Making use of the Block Utility & Block ID

The Scratch runtime will pass a `BlockUtility` object to every block method when it is executed. 

This can help you do things like:
- ...TBD...

### Block ID

PRG has added an additional property to the `BlockUtility`, the `blockID` field, which allows you to uniquely associate an invocation of your block method with a block in the user's environment. Access it as demonstrated below:

[](./index.ts)
