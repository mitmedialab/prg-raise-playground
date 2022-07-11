export type formatter = (className: string, memberName: string) => string;

const _class: formatter = (className: string) => className;
const _constructor: formatter = (className: string) => `${className}()`;
const _member: formatter = (className: string, memberName: string) => memberName;
const _property: formatter = (className: string, memberName: string) => `${className}.${memberName}`;
const _function: formatter = (className: string, memberName: string) => `${_property(className, memberName)}()`;
const _array: formatter = (className: string, memberName: string) => `${_property(className, memberName)}[]`;

type formats = "Class" | "Constructor" | "Member" | "Property" | "Function" | "Array";
export const Format: Record<formats, formatter> = {
  'Class': _class,
  'Constructor': _constructor,
  'Member': _member,
  'Property': _property,
  'Function': _function,
  'Array': _array
}

const nameOf = <T extends Object>(constructor: { prototype: T }, format?: formatter, member?: keyof T & string): string => {
  const className = constructor.prototype.constructor.name;
  if (!format) return className;

  if (format !== _constructor && format !== _class && member === undefined) {
    throw new Error("No member was provided, so cannot format a pattern that leverages the member's name");
  }
  return format(className, member as string);
};

export default nameOf;