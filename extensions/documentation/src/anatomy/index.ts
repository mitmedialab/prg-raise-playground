import { extension } from "$common";
import { codeSnippet } from "documentation";

const DisplayDetails = { name: "" };

export const x = codeSnippet();
export default class ExampleExtension extends extension({ name: "Example" }) {
  init() { /* ... */ };
}
x.end;

