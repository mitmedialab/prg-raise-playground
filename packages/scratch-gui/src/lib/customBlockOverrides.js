import {dropdownStateFlag, openDropdownState, closeDropdownState, initDropdownState, dropdownEntryFlag} from "../dist/globals";

/**
 * @param {import("scratch-blocks")} blocks
 * @param {import("scratch-vm")} vm 
 * @returns 
 */
export const overridesForCustomArgumentSupport = (blocks, vm) => {
  const { FieldDropdown } = blocks;
  const {fromJson, prototype} = FieldDropdown;
  const {setValue, showEditor_ } = prototype;

  const { runtime } = vm;

  const setState = (state, dropdown) => {
    runtime[dropdownStateFlag] = state;
    runtime[dropdownEntryFlag] = dropdown ? {text: dropdown.text_, value: dropdown.value_} : undefined;
  }

  const resetAndReturn = (result) => { 
    setState(null);
    return result;
  };

  FieldDropdown.fromJson = (...args) => {
      setState(initDropdownState, undefined);
      const item = resetAndReturn(fromJson(...args));
      return item;
  };

  FieldDropdown.prototype.setValue = function (...args) {
    setState(closeDropdownState, this);
    return resetAndReturn(setValue.bind(this)(...args));
  };

  FieldDropdown.prototype.showEditor_ = function (...args) {
    setState(openDropdownState, this);
    return resetAndReturn(showEditor_.bind(this)(...args));
  }
}