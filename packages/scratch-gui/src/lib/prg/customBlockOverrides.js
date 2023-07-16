import { guiDropdownInterop } from "../../dist/globals";

/**
 * @param {import("scratch-blocks")} blocks
 * @param {import("scratch-vm")} vm 
 * @returns 
 */
export const overridesForCustomArgumentSupport = (blocks, vm) => {
  const { FieldDropdown } = blocks;
  const { fromJson, prototype } = FieldDropdown;
  const { setValue, showEditor_ } = prototype;
  const { state, runtimeKey, runtimeProperties } = guiDropdownInterop;
  const { runtime } = vm;
  const shared = (runtime[runtimeKey] = {});
  const { stateKey, entryKey, updateMethodKey } = runtimeProperties;

  /**
   * @type {FieldDropdown}
   */
  let current = null;

  const setState = (state, dropdown) => {
    shared[stateKey] = state;
    shared[entryKey] = dropdown ? { text: dropdown.text_, value: dropdown.value_ } : undefined;
  }

  const executeWithState = (state, dropdown, fn, args) => {
    setState(state, dropdown);
    const result = fn.apply(dropdown, args);
    setState(null);
    return result;
  }

  FieldDropdown.fromJson = (...args) => executeWithState(state.init, null, fromJson, args);

  FieldDropdown.prototype.showEditor_ = function (...args) {
    return executeWithState(state.open, (current = this), showEditor_, args);
  };

  FieldDropdown.prototype.setValue = function (...args) {
    current = null;
    return executeWithState(state.close, this, setValue, args);
  };

  shared[updateMethodKey] = (...args) => executeWithState(state.update, current, setValue, args);
}