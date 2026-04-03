/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export const p5CategoryContents = [
  {
    kind: 'block',
    type: 'p5_background_color',
    inputs: {
      COLOR: {
        shadow: {
          type: 'colour_picker',
        },
      },
    },
  },
  {
    kind: 'block',
    type: 'colour_random',
  },
  {
    kind: 'block',
    type: 'draw_emoji',
  },
  {
    kind: 'block',
    type: 'simple_circle',
    inputs: {
      COLOR: {
        shadow: {
          type: 'colour_picker',
        },
      },
    },
  },
  {
    kind: 'label',
    text: 'Writing text',
  },
  {
    kind: 'block',
    type: 'write_text_with_shadow',
    inputs: {
      TEXT: {
        shadow: {
          type: 'text_only',
        },
      },
    },
  },
  {
    kind: 'block',
    type: 'write_text_without_shadow',
  },
];

export const toolbox = {
  'kind': 'flyoutToolbox',
  'contents': p5CategoryContents,
};
