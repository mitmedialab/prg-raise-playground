import { ArgumentType } from "./enums";
type Shadow = {
  type: string,
  fieldName: string,
}
type Details = { shadow: Shadow; } | { fieldType: string } | { check: string };

/**
 * Information used for converting Scratch argument types into scratch-blocks data.
 * @type {object.<ArgumentType, {shadowType: string, fieldType: string}>}
 */
const ArgumentTypeMap: Record<ArgumentType, Details> = (() => ({
  [ArgumentType.Angle]: {
    shadow: {
      type: 'math_angle',
      // We specify fieldNames here so that we can pick
      // create and populate a field with the defaultValue
      // specified in the extension.
      // When the `fieldName` property is not specified,
      // the <field></field> will be left out of the XML and
      // the scratch-blocks defaults for that field will be
      // used instead (e.g. default of 0 for number fields)
      fieldName: 'NUM'
    }
  },
  [ArgumentType.Color]: {
    shadow: {
      type: 'colour_picker',
      fieldName: 'COLOUR'
    }
  },
  [ArgumentType.Number]: {
    shadow: {
      type: 'math_number',
      fieldName: 'NUM'
    }
  },
  [ArgumentType.String]: {
    shadow: {
      type: 'text',
      fieldName: 'TEXT'
    }
  },
  [ArgumentType.Boolean]: {
    check: 'Boolean'
  },
  [ArgumentType.Matrix]: {
    shadow: {
      type: 'matrix',
      fieldName: 'MATRIX'
    }
  },
  [ArgumentType.Note]: {
    shadow: {
      type: 'note',
      fieldName: 'NOTE'
    }
  },
  [ArgumentType.Image]: {
    // Inline images are weird because they're not actually "arguments".
    // They are more analagous to the label on a block.
    fieldType: 'field_image'
  }
}))();

export default ArgumentTypeMap;