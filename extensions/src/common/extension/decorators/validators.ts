import { ExtensionBlocks, ExtensionMenuDisplayDetails } from "$common/types";
import { TypedClassDecorator } from ".";
import { ExtensionConstructor } from "..";
import { Extension } from "../GenericExtension";

/**
 * Used to validate (through type assertion) that a Generic Extension does not
 * define any members with the same name as one of its blocks. 
 * 
 * The Generic Extension `Extension` class predates this requirment of having  no overlap between the keys of blocks and the members of the associated Extension 
 * class, so this decorator is provided as an easy way to check and confirm a Generic Extension class is compliant.
 * 
 * Runtime errors will also be produced if this condition is not met.
 * @param success Will take on a type of `true` if the underlying Generic Extension is valid. Otherwise, it will be of type `never` and be impossible to satisfy.
 * @returns 
 */
export const validGenericExtension = <const T extends Extension<ExtensionMenuDisplayDetails, ExtensionBlocks>>
  (success: T extends Extension<any, infer Blocks> ? T extends { [k in keyof Blocks]: any } ? never : true : never):
  TypedClassDecorator<T, ConstructorParameters<ExtensionConstructor>> => {
  return function (value, context) { }
}