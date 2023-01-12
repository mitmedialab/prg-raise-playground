import {dropdownStateFlag, openDropdownState, closeDropdownState, initDropdownState} from "../dist/globals";

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

  const setState = (state) => runtime[dropdownStateFlag] = state;

  const resetAndReturn = (result) => { 
    setState(null);
    return result;
  };

  FieldDropdown.fromJson = (...args) => {
      setState(initDropdownState);
      return resetAndReturn(fromJson(...args));
  };

  FieldDropdown.prototype.setValue = function (...args) {
    setState(closeDropdownState);
    return resetAndReturn(setValue.bind(this)(...args));
  };

  FieldDropdown.prototype.showEditor_ = function (...args) {
    setState(openDropdownState);
    return resetAndReturn(showEditor_.bind(this)(...args));
  }
}