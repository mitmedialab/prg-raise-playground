<script lang="ts">
  import type Extension from ".";
  import { ReactiveSet, ReactiveInvoke, reactiveInvoke, reactiveSet, activeClass, color, } from "../../typescript-support/ui";

  export let extension: Extension;
  export let close: () => void;

  /**
   * 
   * @param functionName
   * @param args
   */
  const invoke: ReactiveInvoke<Extension> = (functionName, ...args) => reactiveInvoke((extension = extension), functionName, args);
  
  /**
   * 
   * @param propertyName
   * @param value
   */
  const set: ReactiveSet<Extension> = (propertyName, value) => reactiveSet((extension = extension), propertyName, value);

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