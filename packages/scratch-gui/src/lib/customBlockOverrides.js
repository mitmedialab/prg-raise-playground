import { dropdownStateFlag, openDropdownState, closeDropdownState, initDropdownState, updateDropdownState, updateDropdownMethod, dropdownEntryFlag, } from "../dist/globals";

/**
 * @param {import("scratch-blocks")} blocks
 * @param {import("scratch-vm")} vm 
 * @returns 
 */
export const overridesForCustomArgumentSupport = (blocks, vm) => {
  const { FieldDropdown } = blocks;
  const { fromJson, prototype } = FieldDropdown;
  const { setValue, showEditor_ } = prototype;

  const { runtime } = vm;

  /**
   * @type {FieldDropdown}
   */
  let currentDropdown = null;

  const setState = (state, dropdown) => {
    runtime[dropdownStateFlag] = state;
    runtime[dropdownEntryFlag] = dropdown ? { text: dropdown.text_, value: dropdown.value_ } : undefined;
    switch (state) {
      case openDropdownState:
        return currentDropdown = dropdown;
      case closeDropdownState:
        return currentDropdown = null;
    }
  }

  const executeWithState = (state, dropdown, fn, args) => {
    console.log(state, args);
    setState(state, dropdown);
    const result = fn.apply(dropdown, args);
    setState(null);
    return result;
  }

  FieldDropdown.fromJson = (...args) => executeWithState(initDropdownState, undefined, fromJson, args);

  FieldDropdown.prototype.setValue = function (...args) {
    return executeWithState(closeDropdownState, this, setValue, args)
  };

  FieldDropdown.prototype.showEditor_ = function (...args) {
    return executeWithState(openDropdownState, this, showEditor_, args);
  };

  runtime[updateDropdownMethod] = (...args) => executeWithState(updateDropdownState, currentDropdown, setValue, args);

}