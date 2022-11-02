<script lang="ts">
  import type Extension from ".";
  import { invokeFromUI, type InvokeFromUI, type GetFromUI, type SetFromUI, activeClass, pixels, setFromUI, color } from "../../typescript-support/ui";

  export let extension: Extension;
  export let close: () => void;

  const invoke: InvokeFromUI<Extension> = (funcName, ...args) => invokeFromUI((extension = extension), funcName, args);
  const set: SetFromUI<Extension> = (propertyName, value) => setFromUI((extension = extension), propertyName, value);
  const get: GetFromUI<Extension> = (propertyName) => (extension = extension)[propertyName];

  const container = activeClass;
</script>

<style>
  .container {
    text-align: center;
    padding: 30px;
  }
</style>

<div class:container style:width={pixels(360)} style:background-color={color.ui.white} style:color={color.text.primary}>
  Hello, world!
</div>