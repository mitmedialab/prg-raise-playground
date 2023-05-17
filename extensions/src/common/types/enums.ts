import { ValueOf } from "../types";

/**
 * The different kind of blocks that an extension can define
 */
export const BlockType = {
  /**
   * Boolean reporter with hexagonal shape
   */
  Boolean: 'Boolean',

  /**
   * A button (not an actual block) for some special action, like making a variable
   */
  Button: 'button',

  /**
   * Command block
   */
  Command: 'command',

  /**
   * Specialized command block which may or may not run a child branch
   * The thread continues with the next block whether or not a child branch ran.
   */
  Conditional: 'conditional',

  /**
   * Specialized hat block with no implementation function
   * This stack only runs if the corresponding event is emitted by other code.
   */
  Event: 'event',

  /**
   * Hat block which conditionally starts a block stack
   */
  Hat: 'hat',

  /**
   * Specialized command block which may or may not run a child branch
   * If a child branch runs, the thread evaluates the loop block again.
   */
  Loop: 'loop',

  /**
   * General reporter with numeric or string value
   */
  Reporter: 'reporter'
} as const;

export const ArgumentType = {
  /** Numeric value with angle picker. */
  Angle: "angle",

  /** Boolean value with hexagonal placeholder. */
  Boolean: "Boolean",

  /** Numeric value with color picker. */
  Color: "color",

  /** Numeric value with text field. */
  Number: "number",

  /** String value with text field. */
  String: "string",

  /** String value with matrix field. */
  Matrix: "matrix",

  /** MIDI note number with note picker (piano) field. */
  Note: "note",

  /** Inline image on block (as part of the label). */
  Image: "image",

  /** Type added by PRG to support custom arguments */
  Custom: "custom"
} as const;

/**
 * Default types of Target supported by the VM
 * @enum {string} as const;
 */
export const TargetType = {
  /**
   * Rendered target which can move, change costumes, etc.
   */
  Sprite: 'sprite',

  /**
   * Rendered target which cannot move but can change backdrops
   */
  Stage: 'stage'
} as const;

/**
 * These constants are copied from scratch-blocks/core/constants.js
 * @TODO find a way to require() these straight from scratch-blocks... maybe make a scratch-blocks/dist/constants.js?
 * @readonly
 * @enum {int} as const;
 */
export const ScratchBlocksConstants = {
  /**
   * ENUM for output shape: hexagonal (booleans/predicates).
   * @const
   */
  OutputShapeHexagonal: 1,

  /**
   * ENUM for output shape: rounded (numbers).
   * @const
   */
  OutputShapeRound: 2,

  /**
   * ENUM for output shape: squared (any/all values; strings).
   * @const
   */
  OutputShapeSquare: 3
} as const;

export const StageLayering = {
  BackgroundLayer: 'background',
  VideoLayer: 'video',
  PenLayer: 'pen',
  SpriteLayer: 'sprite',
} as const;

export const LayerGroups: readonly ValueOf<typeof StageLayering>[] = [
  StageLayering.VideoLayer,
  StageLayering.SpriteLayer,
  StageLayering.BackgroundLayer,
  StageLayering.PenLayer,
] as const;

export const VariableType = {
  /**
   * Type representation for scalar variables.
   * This is currently represented as ''
   * for compatibility with blockly.
   */
  Scalar: '',
  /**
   * Type representation for list variables.
   */
  List: 'list',

  BrooadcastMessage: 'broadcast_msg'
} as const;

export const Branch = {
  Exit: 0,
  Enter: 1,
  First: 1,
  Second: 2,
  Third: 3,
  Fourth: 4,
  Fifth: 5,
  Sixth: 6,
  Seventh: 7
} as const;

export const Language = {
  Аҧсшәа: 'ab',
  العربية: 'ar',
  አማርኛ: 'am',
  Azeri: 'az',
  Bahasa_Indonesia: 'id',
  Беларуская: 'be',
  Български: 'bg',
  Català: 'ca',
  Česky: 'cs',
  Cymraeg: 'cy',
  Dansk: 'da',
  Deutsch: 'de',
  Eesti: 'et',
  Ελληνικά: 'el',
  English: 'en',
  Español: 'es',
  Español_Latinoamericano: 'es-419',
  Euskara: 'eu',
  فارسی: 'fa',
  Français: 'fr',
  Gaeilge: 'ga',
  Gàidhlig: 'gd',
  Galego: 'gl',
  한국어: 'ko',
  עִבְרִית: 'he',
  Hrvatski: 'hr',
  isiZulu: 'zu',
  Íslenska: 'is',
  Italiano: 'it',
  ქართული_ენა: 'ka',
  Kiswahili: 'sw',
  Kreyòl_ayisyen: 'ht',
  کوردیی_ناوەندی: 'ckb',
  Latviešu: 'lv',
  Lietuvių: 'lt',
  Magyar: 'hu',
  Māori: 'mi',
  Nederlands: 'nl',
  日本語: 'ja',
  にほんご: 'ja-Hira',
  Norsk_Bokmål: 'nb',
  Norsk_Nynorsk: 'nn',
  Oʻzbekcha: 'uz',
  ไทย: 'th',
  ភាសាខ្មែរ: 'km',
  Polski: 'pl',
  Português: 'pt',
  Português_Brasileiro: 'pt-br',
  Rapa_Nui: 'rap',
  Română: 'ro',
  Русский: 'ru',
  Српски: 'sr',
  Slovenčina: 'sk',
  Slovenščina: 'sl',
  Suomi: 'fi',
  Svenska: 'sv',
  Tiếng_Việt: 'vi',
  Türkçe: 'tr',
  Українська: 'uk',
  简体中文: 'zh-cn',
  繁體中文: 'zh-tw'
} as const;

export const LanguageKeys = Object.keys(Language);

export const RuntimeEvent = {
  /**
   * Event name for glowing a script.
   */
  ScriptGlowOn: 'SCRIPT_GLOW_ON',
  /**
   * Event name for unglowing a script.
   */
  ScriptGlowOff: 'SCRIPT_GLOW_OFF',
  /**
   * Event name for glowing a block.
   */
  BlockGlowOn: 'BLOCK_GLOW_ON',
  /**
   * Event name for unglowing a block.
   */
  BlockGlowOff: 'BLOCK_GLOW_OFF',
  /**
   * Event name for a cloud data update to this project.
   */
  HasCloudDataUpdate: 'HAS_CLOUD_DATA_UPDATE',
  /**
   * Event name for turning on turbo mode.
   */
  TurboModeOn: 'TURBO_MODE_ON',
  /**
   * Event name for turning off turbo mode.
   */
  TurboModeOff: 'TURBO_MODE_OFF',
  /**
   * Event name for turning on turbo mode.
   */
  RecordingOn: 'RECORDING_ON',
  /**
   * Event name for turning off turbo mode.
   */
  RecordingOff: 'RECORDING_OFF',
  /**
   * Event name when the project is started (threads may not necessarily be running).
   */
  ProjectStart: 'PROJECT_START',
  /**
   * Event name when threads start running.
   * Used by the UI to indicate running status.
   */
  ProjectRunStart: 'PROJECT_RUN_START',
  /**
   * Event name when threads stop running
   * Used by the UI to indicate not-running status.
   */
  ProjectRunStop: 'PROJECT_RUN_STOP',
  /**
   * Event name for project being stopped or restarted by the user.
   * Used by blocks that need to reset state.
   */
  ProjectStopAll: 'PROJECT_STOP_ALL',
  /**
   * Event name for target being stopped by a stop for target call.
   * Used by blocks that need to stop individual targets.
   */
  StopForTarget: 'STOP_FOR_TARGET',
  /**
   * Event name for visual value report.
   */
  VisualReport: 'VISUAL_REPORT',
  /**
   * Event name for project loaded report.
   */
  ProjectLoaded: 'PROJECT_LOADED',
  /**
   * Event name for report that a change was made that can be saved
   */
  ProjectChanged: 'PROJECT_CHANGED',
  /**
   * Event name for report that a change was made to an extension in the toolbox.
   */
  ToolboxExtensionsNeedUpdate: 'TOOLBOX_EXTENSIONS_NEED_UPDATE',
  /**
   * Event name for targets update report.
   */
  TargetsUpdate: 'TARGETS_UPDATE',
  /**
   * Event name for monitors update.
   */
  MonitorsUpdate: 'MONITORS_UPDATE',
  /**
   * Event name for block drag update.
   */
  BlockDragUpdate: 'BLOCK_DRAG_UPDATE',
  /**
   * Event name for block drag end.
   */
  BlockDragEnd: 'BLOCK_DRAG_END',
  /**
   * Event name for reporting that an extension was added.
   */
  ExtensionAdded: 'EXTENSION_ADDED',
  /**
   * Event name for reporting that an extension as asked for a custom field to be added
   */
  ExtensionFieldAdded: 'EXTENSION_FIELD_ADDED',
  /**
   * Event name for updating the available set of peripheral devices.
   * This causes the peripheral connection modal to update a list of available peripherals.
   */
  PeripheralListUpdate: 'PERIPHERAL_LIST_UPDATE',
  /**
   * Event name for reporting that a peripheral has connected.
   * This causes the status button in the blocks menu to indicate 'connected'.
   */
  PeripheralConnected: 'PERIPHERAL_CONNECTED',
  /**
   * Event name for reporting that a peripheral has been intentionally disconnected.
   * This causes the status button in the blocks menu to indicate 'disconnected'.
   */
  PeripheralDisconnected: 'PERIPHERAL_DISCONNECTED',
  /**
   * Event name for reporting that a peripheral has encountered a request error.
   * This causes the peripheral connection modal to switch to an error state.
   */
  PeripheralRequestError: 'PERIPHERAL_REQUEST_ERROR',
  /**
   * Event name for reporting that a peripheral connection has been lost.
   * This causes a 'peripheral connection lost' error alert to display.
   */
  PeripheralConnectionLostError: 'PERIPHERAL_CONNECTION_LOST_ERROR',
  /**
   * Event name for reporting that a peripheral has not been discovered.
   * This causes the peripheral connection modal to show a timeout state.
   */
  PeripheralScanTimeout: 'PERIPHERAL_SCAN_TIMEOUT',
  /**
   * Event name to indicate that the microphone is being used to stream audio.
   */
  MicListening: 'MIC_LISTENING',
  /**
   * Event name for reporting that blocksInfo was updated.
   */
  BlocksInfoUpdate: 'BLOCKSINFO_UPDATE',
  /**
   * Event name when the runtime tick loop has been started.
   */
  RuntimeStarted: 'RUNTIME_STARTED',
  /**
   * Event name when the runtime dispose has been called.
   */
  RuntimeDisposed: 'RUNTIME_DISPOSED',
  /**
   * Event name for reporting that a block was updated and needs to be rerendered.
   */
  BlocksNeedUpdate: 'BLOCKS_NEED_UPDATE',
  /**
   * Report that a new target has been created, possibly by cloning an existing target.
   */
  TargetWasCreated: 'targetWasCreated',
} as const;
