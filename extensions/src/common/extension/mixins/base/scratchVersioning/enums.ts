export const CORE_EXTENSIONS = [
    'argument',
    'colour',
    'control',
    'data',
    'event',
    'looks',
    'math',
    'motion',
    'operator',
    'procedures',
    'sensing',
    'sound'
];

type PrimitiveFieldName = 'NUM' | 'COLOUR' | 'TEXT' | 'BROADCAST_OPTION' | 'VARIABLE' | 'LIST';
type PrimitiveOpcodeInfo = { code: number, name: PrimitiveFieldName };

// math_number
const MATH_NUM_PRIMITIVE = 4; // there's no reason these constants can't collide
// math_positive_number
const POSITIVE_NUM_PRIMITIVE = 5; // with the above, but removing duplication for clarity
// math_whole_number
const WHOLE_NUM_PRIMITIVE = 6;
// math_integer
const INTEGER_NUM_PRIMITIVE = 7;
// math_angle
const ANGLE_NUM_PRIMITIVE = 8;
// colour_picker
const COLOR_PICKER_PRIMITIVE = 9;
// text
const TEXT_PRIMITIVE = 10;
// event_broadcast_menu
const BROADCAST_PRIMITIVE = 11;
// data_variable
const VAR_PRIMITIVE = 12;
// data_listcontents
const LIST_PRIMITIVE = 13;

/**
 * Map block opcodes to their primitive 'code' and the name of the field we can use to find the value of the field.
 */
export const primitiveOpcodeInfoMap = {
    math_number: { code: 4, name: 'NUM' },
    math_positive_number: { code: 5, name: 'NUM' },
    math_whole_number: { code: 6, name: 'NUM' },
    math_integer: { code: 7, name: 'NUM' },
    math_angle: { code: 8, name: 'NUM' },
    colour_picker: { code: 9, name: 'COLOUR' },
    text: { code: 10, name: 'TEXT' },
    event_broadcast_menu: { code: 11, name: 'BROADCAST_OPTION' },
    data_variable: { code: 12, name: 'VARIABLE' },
    data_listcontents: { code: 13, name: 'LIST' },
} as const satisfies Record<string, PrimitiveOpcodeInfo>;