/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

const sunnyDay = {
  'blocks': {
    'languageVersion': 0,
    'blocks': [
      {
        'type': 'p5_setup',
        'id': '5.{;T}3Qv}Awi:1M$:ut',
        'x': 0,
        'y': 75,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'p5_canvas',
              'id': 'spya_H-5F=K8+DhedX$y',
              'deletable': false,
              'movable': false,
              'fields': {
                'WIDTH': 400,
                'HEIGHT': 400,
              },
              'next': {
                'block': {
                  'type': 'p5_background_color',
                  'id': 'i/Hvi~^DYffkN/WpT_Ck',
                  'inputs': {
                    'COLOR': {
                      'shadow': {
                        'type': 'colour_picker',
                        'id': 'B:zpi7kg+.GF_Dutd9GL',
                        'fields': {
                          'COLOUR': '#9999ff',
                        },
                      },
                    },
                  },
                  'next': {
                    'block': {
                      'type': 'p5_stroke',
                      'id': 'I}RN|0g#W,(kh2Cx}9)Z',
                      'inputs': {
                        'COLOR': {
                          'shadow': {
                            'type': 'colour_picker',
                            'id': '`i.j^X!DV:9;]X5[6Lq/',
                            'fields': {
                              'COLOUR': '#ffff00',
                            },
                          },
                        },
                      },
                      'next': {
                        'block': {
                          'type': 'p5_fill',
                          'id': 'JlM!Jyw@s5J5/?9fs8Wi',
                          'inputs': {
                            'COLOR': {
                              'shadow': {
                                'type': 'colour_picker',
                                'id': '^a`BlAD,AV]iN^Qvck~E',
                                'fields': {
                                  'COLOUR': '#ffff00',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        'type': 'p5_draw',
        'id': '3iI4f%2#Gmk}=OjI7(8h',
        'x': 0,
        'y': 332,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'p5_ellipse',
              'id': '_}!@OHwjAb,2Gi8nT0}L',
              'inline': true,
              'inputs': {
                'X': {
                  'shadow': {
                    'type': 'math_number',
                    'id': '_0MCsD2LK%j.$YOf3#R/',
                    'fields': {
                      'NUM': 100,
                    },
                  },
                },
                'Y': {
                  'shadow': {
                    'type': 'math_number',
                    'id': 'gq(POne}j:hVw%C3t{vx',
                    'fields': {
                      'NUM': 100,
                    },
                  },
                },
                'WIDTH': {
                  'shadow': {
                    'type': 'math_number',
                    'id': '3RP[-C^1|8zA.^]81M0m',
                    'fields': {
                      'NUM': 50,
                    },
                  },
                },
                'HEIGHT': {
                  'shadow': {
                    'type': 'math_number',
                    'id': '8kKn|lOU8xckQ+#+Q7=~',
                    'fields': {
                      'NUM': 50,
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

const blankCanvas = {
  'blocks': {
    'languageVersion': 0,
    'blocks': [
      {
        'type': 'p5_setup',
        'id': '5.{;T}3Qv}Awi:1M$:ut',
        'x': 0,
        'y': 75,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'p5_canvas',
              'id': 'spya_H-5F=K8+DhedX$y',
              'deletable': false,
              'movable': false,
              'fields': {
                'WIDTH': 400,
                'HEIGHT': 400,
              },
            },
          },
        },
      },
      {
        'type': 'p5_draw',
        'id': '3iI4f%2#Gmk}=OjI7(8h',
        'x': 0,
        'y': 332,
        'deletable': false,
      },
    ],
  },
};

const simpleCircle = {
  'blocks': {
    'languageVersion': 0,
    'blocks': [
      {
        'type': 'p5_setup',
        'id': 'p5_setup_1',
        'x': 0,
        'y': 75,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'p5_canvas',
              'id': 'create_canvas_1',
              'deletable': false,
              'movable': false,
              'fields': {
                'WIDTH': 400,
                'HEIGHT': 400,
              },
              'next': {
                'block': {
                  'type': 'p5_background_color',
                  'id': 'set_background_color_1',
                  'inputs': {
                    'COLOR': {
                      'shadow': {
                        'type': 'colour_picker',
                        'id': 'set_background_color_1_color',
                        'fields': {
                          'COLOUR': '#9999ff',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        'type': 'p5_draw',
        'id': 'p5_draw_1',
        'x': 0,
        'y': 332,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'simple_circle',
              'id': 'draw_circle_1',
              'inline': true,
              'inputs': {
                'COLOR': {
                  'shadow': {
                    'type': 'colour_picker',
                    'id': 'draw_circle_1_color',
                    'fields': {
                      'COLOUR': '#ffff00',
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

const moreBlocks = {
  'blocks': {
    'languageVersion': 0,
    'blocks': [
      {
        'type': 'p5_setup',
        'id': '5.{;T}3Qv}Awi:1M$:ut',
        'x': 0,
        'y': 75,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'p5_canvas',
              'id': 'spya_H-5F=K8+DhedX$y',
              'deletable': false,
              'movable': false,
              'fields': {
                'WIDTH': 400,
                'HEIGHT': 400,
              },
              'next': {
                'block': {
                  'type': 'p5_background_color',
                  'id': 'i/Hvi~^DYffkN/WpT_Ck',
                  'inputs': {
                    'COLOR': {
                      'shadow': {
                        'type': 'colour_picker',
                        'id': 'B:zpi7kg+.GF_Dutd9GL',
                        'fields': {
                          'COLOUR': '#9999ff',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        'type': 'p5_draw',
        'id': '3iI4f%2#Gmk}=OjI7(8h',
        'x': 0,
        'y': 332,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'simple_circle',
              'id': 'draw_circle_1',
              'inline': true,
              'inputs': {
                'COLOR': {
                  'shadow': {
                    'type': 'colour_picker',
                    'id': 'gq(POne}j:hVw%C3t{vx',
                    'fields': {
                      'COLOUR': '#ffff00',
                    },
                  },
                },
              },
              'next': {
                'block': {
                  'type': 'text_print',
                  'id': 'text_print_1',
                  'inputs': {
                    'TEXT': {
                      'shadow': {
                        'type': 'text',
                        'id': 'text_print_shadow_text_1',
                        'fields': {
                          'TEXT': 'abc',
                        },
                      },
                    },
                  },
                  'next': {
                    'block': {
                      'type': 'controls_if',
                      'id': ',rP|uDy,esfrOeQrk64u',
                      'inputs': {
                        'IF0': {
                          'block': {
                            'type': 'logic_negate',
                            'id': '8iH/,SwwTfk7iR;~m^s[',
                          },
                        },
                        'DO0': {
                          'block': {
                            'type': 'text_print',
                            'id': 'text_print_2',
                            'inputs': {
                              'TEXT': {
                                'shadow': {
                                  'type': 'text',
                                  'id': 'j|)#Di2,(L^TK)iLI3LC',
                                  'fields': {
                                    'TEXT': 'abc',
                                  },
                                },
                                'block': {
                                  'type': 'math_arithmetic',
                                  'id': 'mRTJ4D+(mjBnUy8c4KaT',
                                  'fields': {
                                    'OP': 'ADD',
                                  },
                                  'inputs': {
                                    'A': {
                                      'shadow': {
                                        'type': 'math_number',
                                        'id': 'hxGO;t4bA9$.~|E6Gy~H',
                                        'fields': {
                                          'NUM': 1,
                                        },
                                      },
                                    },
                                    'B': {
                                      'shadow': {
                                        'type': 'math_number',
                                        'id': 'P,$Lqn5{mFE?R)#~v|/V',
                                        'fields': {
                                          'NUM': 1,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      'next': {
                        'block': {
                          'type': 'text_print',
                          'id': 'text_print_3',
                          'inputs': {
                            'TEXT': {
                              'shadow': {
                                'type': 'text',
                                'id': 'cy+0[WR6]O(x%Q;~c*0f',
                                'fields': {
                                  'TEXT': 'abc',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

const navigationTestBlocks = {
  'blocks': {
    'languageVersion': 0,
    'blocks': [
      {
        'type': 'p5_setup',
        'id': 'p5_setup_1',
        'x': 0,
        'y': 75,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'p5_canvas',
              'id': 'p5_canvas_1',
              'deletable': false,
              'movable': false,
              'fields': {
                'WIDTH': 400,
                'HEIGHT': 400,
              },
            },
          },
        },
      },
      {
        'type': 'p5_draw',
        'id': 'p5_draw_1',
        'x': 0,
        'y': 332,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'controls_if',
              'id': 'controls_if_1',
              'next': {
                'block': {
                  'type': 'controls_if',
                  'id': 'controls_if_2',
                  'inputs': {
                    'IF0': {
                      'block': {
                        'type': 'logic_boolean',
                        'id': 'logic_boolean_1',
                        'fields': {
                          'BOOL': 'TRUE',
                        },
                      },
                    },
                    'DO0': {
                      'block': {
                        'type': 'text_print',
                        'id': 'text_print_1',
                        'inputs': {
                          'TEXT': {
                            'shadow': {
                              'type': 'text',
                              'id': 'text_1',
                              'fields': {
                                'TEXT': 'abc',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  'next': {
                    'block': {
                      'type': 'controls_repeat',
                      'id': 'controls_repeat_1',
                      'fields': {
                        'TIMES': 10,
                      },
                      'inputs': {
                        'DO': {
                          'block': {
                            'type': 'draw_emoji',
                            'id': 'draw_emoji_1',
                            'fields': {
                              'emoji': '❤️',
                            },
                            'next': {
                              'block': {
                                'type': 'simple_circle',
                                'id': 'simple_circle_1',
                                'inputs': {
                                  'COLOR': {
                                    'shadow': {
                                      'type': 'colour_picker',
                                      'id': 'colour_picker_1',
                                      'fields': {
                                        'COLOUR': '#ff0000',
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      'next': {
                        'block': {
                          'type': 'controls_repeat_ext',
                          'id': 'controls_repeat_ext_1',
                          'inputs': {
                            'TIMES': {
                              'shadow': {
                                'type': 'math_number',
                                'id': 'math_number_1',
                                'fields': {
                                  'NUM': 10,
                                },
                              },
                              'block': {
                                'type': 'math_modulo',
                                'id': 'math_modulo_1',
                                'inputs': {
                                  'DIVIDEND': {
                                    'shadow': {
                                      'type': 'math_number',
                                      'id': 'math_number_2',
                                      'fields': {
                                        'NUM': 64,
                                      },
                                    },
                                  },
                                  'DIVISOR': {
                                    'shadow': {
                                      'type': 'math_number',
                                      'id': 'math_number_3',
                                      'fields': {
                                        'NUM': 10,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

// The draw block contains a stack of statement blocks, each of which
// has a value input to which is connected a value expression block
// which itself has one or two inputs which have (non-shadow) simple
// value blocks connected.  Each statement block will be selected in
// turn and then a move initiated (and then aborted).  This is then
// repeated with the first level value blocks (those that are attached
// to the statement blocks).  The second level value blocks are
// present to verify correct (lack of) heal behaviour.
const moveStartTestBlocks = {
  'blocks': {
    'languageVersion': 0,
    'blocks': [
      {
        'type': 'p5_setup',
        'id': 'p5_setup_1',
        'x': 0,
        'y': 75,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'p5_canvas',
              'id': 'p5_canvas_1',
              'deletable': false,
              'movable': false,
              'fields': {
                'WIDTH': 400,
                'HEIGHT': 400,
              },
            },
          },
        },
      },
      {
        'type': 'p5_draw',
        'id': 'p5_draw_1',
        'x': 0,
        'y': 332,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'controls_if',
              'id': 'statement_1',
              'inputs': {
                'IF0': {
                  'block': {
                    'type': 'logic_operation',
                    'id': 'value_1',
                    'fields': {
                      'OP': 'AND',
                    },
                    'inputs': {
                      'A': {
                        'block': {
                          'type': 'logic_boolean',
                          'id': 'value_1_1',
                          'fields': {
                            'BOOL': 'TRUE',
                          },
                        },
                      },
                      'B': {
                        'block': {
                          'type': 'logic_boolean',
                          'id': 'value_1_2',
                          'fields': {
                            'BOOL': 'TRUE',
                          },
                        },
                      },
                    },
                  },
                },
              },
              'next': {
                'block': {
                  'type': 'controls_if',
                  'id': 'statement_2',
                  'inputs': {
                    'IF0': {
                      'block': {
                        'type': 'logic_negate',
                        'id': 'value_2',
                        'inputs': {
                          'BOOL': {
                            'block': {
                              'type': 'logic_boolean',
                              'id': 'value_2_1',
                              'fields': {
                                'BOOL': 'TRUE',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  'next': {
                    'block': {
                      'type': 'controls_repeat_ext',
                      'id': 'statement_3',
                      'inputs': {
                        'TIMES': {
                          'shadow': {
                            'type': 'math_number',
                            'id': 'shadow_3',
                            'fields': {
                              'NUM': 10,
                            },
                          },
                          'block': {
                            'type': 'math_arithmetic',
                            'id': 'value_3',
                            'fields': {
                              'OP': 'ADD',
                            },
                            'inputs': {
                              'A': {
                                'shadow': {
                                  'type': 'math_number',
                                  'id': 'shadow_3_1',
                                  'fields': {
                                    'NUM': 1,
                                  },
                                },
                                'block': {
                                  'type': 'math_number',
                                  'id': 'value_3_1',
                                  'fields': {
                                    'NUM': 0,
                                  },
                                },
                              },
                              'B': {
                                'shadow': {
                                  'type': 'math_number',
                                  'id': 'shadow_3_2',
                                  'fields': {
                                    'NUM': 1,
                                  },
                                },
                                'block': {
                                  'type': 'math_number',
                                  'id': 'value_3_2',
                                  'fields': {
                                    'NUM': 0,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      'next': {
                        'block': {
                          'type': 'controls_repeat_ext',
                          'id': 'statement_4',
                          'inputs': {
                            'TIMES': {
                              'shadow': {
                                'type': 'math_number',
                                'id': 'shadow_4',
                                'fields': {
                                  'NUM': 10,
                                },
                              },
                              'block': {
                                'type': 'math_trig',
                                'id': 'value_4',
                                'fields': {
                                  'OP': 'SIN',
                                },
                                'inputs': {
                                  'NUM': {
                                    'shadow': {
                                      'type': 'math_number',
                                      'id': 'shadow_4_1',
                                      'fields': {
                                        'NUM': 45,
                                      },
                                    },
                                    'block': {
                                      'type': 'math_number',
                                      'id': 'value_4_1',
                                      'fields': {
                                        'NUM': 180,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                          'next': {
                            'block': {
                              'type': 'text_print',
                              'id': 'statement_5',
                              'inputs': {
                                'TEXT': {
                                  'shadow': {
                                    'type': 'text',
                                    'id': 'shadow_5',
                                    'fields': {
                                      'TEXT': 'abc',
                                    },
                                  },
                                  'block': {
                                    'type': 'text_join',
                                    'id': 'value_5',
                                    'extraState': {
                                      'itemCount': 2,
                                    },
                                    'inputs': {
                                      'ADD0': {
                                        'block': {
                                          'type': 'text',
                                          'id': 'value_5_1',
                                          'fields': {
                                            'TEXT': 'test',
                                          },
                                        },
                                      },
                                      'ADD1': {
                                        'block': {
                                          'type': 'text',
                                          'id': 'value_5_2',
                                          'fields': {
                                            'TEXT': 'test',
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              'next': {
                                'block': {
                                  'type': 'text_print',
                                  'id': 'statement_6',
                                  'inputs': {
                                    'TEXT': {
                                      'shadow': {
                                        'type': 'text',
                                        'id': 'shadow_6',
                                        'fields': {
                                          'TEXT': 'abc',
                                        },
                                      },
                                      'block': {
                                        'type': 'text_reverse',
                                        'id': 'value_6',
                                        'inputs': {
                                          'TEXT': {
                                            'shadow': {
                                              'type': 'text',
                                              'id': 'shadow_6_1',
                                              'fields': {
                                                'TEXT': '',
                                              },
                                            },
                                            'block': {
                                              'type': 'text',
                                              'id': 'value_6_1',
                                              'fields': {
                                                'TEXT': 'test',
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                  'next': {
                                    'block': {
                                      'type': 'draw_emoji',
                                      'id': 'statement_7',
                                      'fields': {
                                        'emoji': '❤️',
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

// A bunch of statement blocks.  It is intended that statement blocks
// to be moved can be attached to the next connection of p5_canvas,
// and then be (constrained-)moved up, down, left and right to verify
// that they visit all the expected candidate connections.
const moveStatementTestBlocks = {
  'blocks': {
    'languageVersion': 0,
    'blocks': [
      {
        'type': 'p5_setup',
        'id': 'p5_setup',
        'x': 75,
        'y': 75,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'p5_canvas',
              'id': 'p5_canvas',
              'deletable': false,
              'movable': false,
              'fields': {
                'WIDTH': 400,
                'HEIGHT': 400,
              },
            },
          },
        },
      },
      {
        'type': 'text_print',
        'id': 'text_print',
        'disabledReasons': ['MANUALLY_DISABLED'],
        'x': 75,
        'y': 400,
        'inputs': {
          'TEXT': {
            'shadow': {
              'type': 'text',
              'id': 'shadow_text',
              'fields': {
                'TEXT': 'abc',
              },
            },
          },
        },
        'next': {
          'block': {
            'type': 'controls_if',
            'id': 'controls_if',
            'extraState': {
              'elseIfCount': 1,
              'hasElse': true,
            },
            'inputs': {
              'DO0': {
                'block': {
                  'type': 'controls_repeat_ext',
                  'id': 'controls_repeat_ext',
                  'inputs': {
                    'TIMES': {
                      'shadow': {
                        'type': 'math_number',
                        'id': 'shadow_math_number',
                        'fields': {
                          'NUM': 10,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        'type': 'p5_draw',
        'id': 'p5_draw',
        'x': 75,
        'y': 950,
        'deletable': false,
      },
    ],
  },
};

const moveValueTestBlocks = {
  'blocks': {
    'languageVersion': 0,
    'blocks': [
      {
        'type': 'p5_setup',
        'id': 'p5_setup',
        'x': 75,
        'y': 75,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'p5_canvas',
              'id': 'p5_canvas',
              'deletable': false,
              'movable': false,
              'fields': {
                'WIDTH': 400,
                'HEIGHT': 400,
              },
            },
          },
        },
      },
      {
        'type': 'text_join',
        'id': 'join0',
        'x': 75,
        'y': 200,
      },
      {
        'type': 'p5_draw',
        'id': 'p5_draw',
        'x': 75,
        'y': 300,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'text_print',
              'id': 'print1',
              'next': {
                'block': {
                  'type': 'text_print',
                  'id': 'print2',
                  'inputs': {
                    'TEXT': {
                      'shadow': {
                        'type': 'text',
                        'id': 'shadow_print2',
                        'fields': {
                          'TEXT': 'shadow',
                        },
                      },
                    },
                  },
                  'next': {
                    'block': {
                      'type': 'draw_emoji',
                      'id': 'draw_emoji',
                      'fields': {
                        'emoji': '🐻',
                      },
                      'next': {
                        'block': {
                          'type': 'text_print',
                          'id': 'print3',
                          'inputs': {
                            'TEXT': {
                              'block': {
                                'type': 'text_join',
                                'id': 'join1',
                                'inline': true,
                                'inputs': {
                                  'ADD0': {
                                    'shadow': {
                                      'type': 'text',
                                      'id': 'shadow_join',
                                      'fields': {
                                        'TEXT': 'inline',
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                          'next': {
                            'block': {
                              'type': 'controls_repeat_ext',
                              'id': 'controls_repeat_ext',
                              'inputs': {
                                'TIMES': {
                                  'shadow': {
                                    'type': 'math_number',
                                    'id': 'shadow_repeat',
                                    'fields': {
                                      'NUM': 1,
                                    },
                                  },
                                },
                                'DO': {
                                  'block': {
                                    'type': 'text_print',
                                    'id': 'print4',
                                    'inputs': {
                                      'TEXT': {
                                        'block': {
                                          'type': 'text_join',
                                          'id': 'join2',
                                          'inline': false,
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

const comments = {
  'workspaceComments': [
    {
      'height': 100,
      'width': 146.63990783691406,
      'id': 'workspace_comment_1',
      'x': 96.5390625,
      'y': 531.42578125,
      'text': 'Workspace comment',
    },
  ],
  'blocks': {
    'languageVersion': 0,
    'blocks': [
      {
        'type': 'p5_setup',
        'id': 'p5_setup_1',
        'x': 0,
        'y': 75,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'p5_canvas',
              'id': 'create_canvas_1',
              'deletable': false,
              'movable': false,
              'fields': {
                'WIDTH': 400,
                'HEIGHT': 400,
              },
              'next': {
                'block': {
                  'type': 'p5_background_color',
                  'id': 'set_background_color_1',
                  'inputs': {
                    'COLOR': {
                      'shadow': {
                        'type': 'colour_picker',
                        'id': 'set_background_color_1_color',
                        'fields': {
                          'COLOUR': '#9999ff',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        'type': 'p5_draw',
        'id': 'p5_draw_1',
        'x': 0,
        'y': 332,
        'deletable': false,
        'inputs': {
          'STATEMENTS': {
            'block': {
              'type': 'simple_circle',
              'id': 'draw_circle_1',
              'icons': {
                'comment': {
                  'text': 'Pinned block comment',
                  'pinned': true,
                  'height': 80,
                  'width': 160,
                },
              },
              'inputs': {
                'COLOR': {
                  'shadow': {
                    'type': 'colour_picker',
                    'id': 'draw_circle_1_color',
                    'fields': {
                      'COLOUR': '#ffff00',
                    },
                  },
                },
              },
              'next': {
                'block': {
                  'type': 'simple_circle',
                  'id': 'draw_circle_2',
                  'icons': {
                    'comment': {
                      'text': 'Unpinned block comment',
                      'pinned': false,
                      'height': 80,
                      'width': 160,
                    },
                  },
                  'inputs': {
                    'COLOR': {
                      'shadow': {
                        'type': 'colour_picker',
                        'id': 'draw_circle_2_color',
                        'fields': {
                          'COLOUR': '#000000',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

const emptyWorkspace = {
  'blocks': {
    'blocks': [],
  },
};

/**
 * Loads saved state from local storage into the given workspace.
 * @param {Blockly.Workspace} workspace Blockly workspace to load into.
 * @param {string} scenarioString Which scenario to load.
 */
export const load = function (workspace, scenarioString) {
  const scenarioMap = {
    'blank': blankCanvas,
    comments,
    moreBlocks,
    moveStartTestBlocks,
    moveStatementTestBlocks,
    moveValueTestBlocks,
    navigationTestBlocks,
    simpleCircle,
    'sun': sunnyDay,
    emptyWorkspace,
  };
  // Don't emit events during loading.
  Blockly.Events.disable();
  Blockly.serialization.workspaces.load(
    scenarioMap[scenarioString],
    workspace,
    false,
  );
  Blockly.Events.enable();
};
