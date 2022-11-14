<script lang="ts">
  import type Extension from ".";
  import { ReactiveSet, ReactiveInvoke, reactiveInvoke, reactiveSet, activeClass, color, } from "../../typescript-support/ui";

  export let extension: Extension;
  export let close: () => void;

  /**
   * @summary Use this to invoke functions on your extension.
   * @description Use this function instead of invoking functions on your extension directly,
   * as this ensures your UI will be refreshed after the function is called 
   * (in case any of your extension's properties have changed which should therefore be updated in the UI).
   * @param functionName Name of the function to invoke
   * @param args Arguments of the specified funtion
   * @example
   * ```ts
   * // do this:
   * invoke("someFunction", 4, "argument 2");
   * // instead of this:
   * extension.someFunction(4, "argument 2");
   * ```
   */
  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) => reactiveInvoke((extension = extension), functionName, args);

  const container = activeClass;
</script>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }
</style>

<div class:container style:width="360px" style:background-color={color.ui.white} style:color={color.text.primary}>
  Hello, world!
</div>