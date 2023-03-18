var ExtensionFramework=(function(exports){'use strict';/**
 * The different kind of blocks that an extension can define
 */
const BlockType = {
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
};
const ArgumentType = {
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
};
/**
 * Default types of Target supported by the VM
 * @enum {string} as const;
 */
const TargetType = {
    /**
     * Rendered target which can move, change costumes, etc.
     */
    Sprite: 'sprite',
    /**
     * Rendered target which cannot move but can change backdrops
     */
    Stage: 'stage'
};
/**
 * These constants are copied from scratch-blocks/core/constants.js
 * @TODO find a way to require() these straight from scratch-blocks... maybe make a scratch-blocks/dist/constants.js?
 * @readonly
 * @enum {int} as const;
 */
const ScratchBlocksConstants = {
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
};
const StageLayering = {
    BackgroundLayer: 'background',
    VideoLayer: 'video',
    PenLayer: 'pen',
    SpriteLayer: 'sprite',
};
const LayerGroups = [
    StageLayering.VideoLayer,
    StageLayering.SpriteLayer,
    StageLayering.BackgroundLayer,
    StageLayering.PenLayer,
];
const VariableType = {
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
};
const Branch = {
    Exit: 0,
    Enter: 1,
    First: 1,
    Second: 2,
    Third: 3,
    Fourth: 4,
    Fifth: 5,
    Sixth: 6,
    Seventh: 7
};
const Language = {
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
};
const LanguageKeys = Object.keys(Language);
const RuntimeEvent = {
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
};const getValueFromMenuItem = (item) => typeof item === "object" ? item.value : item;
const getTextFromMenuItem = (item) => typeof item === "object" ? item.text : item;
async function fetchWithTimeout(resource, options) {
    const { timeout } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);
    return response;
}
async function untilTimePassed(timeMs) {
    return await new Promise((resolve) => setTimeout(resolve, timeMs));
}
async function untilObject(getter, delay = 100) {
    let timeout;
    let value = getter();
    while (!value) {
        await new Promise(resolve => {
            clearTimeout(timeout);
            timeout = setTimeout(resolve, delay);
        });
        value = getter();
    }
    clearTimeout(timeout);
    return value;
}
async function untilCondition(condition, delay = 100) {
    let timeout;
    while (!condition()) {
        await new Promise(resolve => {
            clearTimeout(timeout);
            timeout = setTimeout(resolve, delay);
        });
    }
    clearTimeout(timeout);
}
async function untilReady(obj, delay = 100) {
    let timeout;
    while (!obj.ready) {
        await new Promise(resolve => {
            clearTimeout(timeout);
            timeout = setTimeout(resolve, delay);
        });
    }
    clearTimeout(timeout);
}
const isString = (query) => typeof query === 'string' || query instanceof String;
const isFunction = (query) => Object.prototype.toString.call(query) === "[object Function]"
    || "function" === typeof query
    || query instanceof Function;
const isPrimitive = (query) => query !== Object(query);
const splitOnCapitals = (query) => query.split(/(?=[A-Z])/);
/**
 * A type safe utility function for copy values from one object to another
 * @param param0 object containing the target to copy values to and the source of the values to copy
 */
const copyTo = ({ target, source }) => {
    for (const key in source) {
        if (!(key in target))
            continue;
        // @ts-ignore -- the types of the function should ensure this is valid TS
        target[key] = source[key];
    }
};
const identity = (x) => x;
const loadExternalScript = (url, onLoad, onError) => {
    const script = document.createElement('script');
    script.onload = onLoad;
    script.onerror = onError ?? (() => {
        throw new Error(`Error loading endpoint: ${url}`);
    });
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
};
/**
 *
 * @param url
 * @returns
 */
const untilExternalScriptLoaded = async (url) => {
    const scriptLoaded = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.onload = resolve;
        script.onerror = reject;
        script.async = true;
        script.src = url;
        document.body.appendChild(script);
    });
    await scriptLoaded;
    return;
};
/**
 *
 * @param url
 * @param globalVariableName
 * @returns
 */
const untilExternalGlobalVariableLoaded = async (url, globalVariableName) => {
    if (window[globalVariableName])
        return window[globalVariableName];
    await untilExternalScriptLoaded(url);
    return window[globalVariableName];
};
/**
 * Utilize javascript's "call" method (on Function.prototype) in a typesafe manner
 * @param fn
 * @param _this
 * @param args
 * @returns
 */
const typesafeCall = (fn, _this, ...args) => fn.call(_this, ...args);
const set = (container, key, value) => {
    container[key] = value;
    return container;
};
const assertSameLength = (...collections) => {
    const { size } = collections.reduce((set, { length }) => set.add(length), new Set());
    if (size !== 1)
        throw new Error("Zip failed because collections weren't equal length");
};
/**
 * Convert a Scratch decimal color to a hex string, #RRGGBB.
 * @param {number} decimal RGB color as a decimal.
 * @return {string} RGB color as #RRGGBB hex string.
 */
const decimalToHex = (decimal) => {
    if (decimal < 0) {
        decimal += 0xFFFFFF + 1;
    }
    let hex = Number(decimal).toString(16);
    hex = `#${'000000'.substr(0, 6 - hex.length)}${hex}`;
    return hex;
};
/**
 * Convert an RGB color object to a Scratch decimal color.
 * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
 * @return {!number} Number representing the color.
 */
function rgbToDecimal(rgb) {
    return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
}
/**
 * Convert an RGB color object to a hex color.
 * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
 * @return {!string} Hex representation of the color.
 */
const rgbToHex = (rgb) => {
    return decimalToHex(rgbToDecimal(rgb));
};const openUIEvent = "OPEN_UI_FROM_EXTENSION";
const registerButtonCallbackEvent = "REGISTER_BUTTON_CALLBACK_FROM_EXTENSION";
const FrameworkID = "ExtensionFramework";
const customArgumentFlag = "internal_IsCustomArgument";
const customArgumentCheck = "isCustomArgumentHack";
const dropdownStateFlag = "dropdownState";
const dropdownEntryFlag = "dropdownEntry";
const initDropdownState = "init";
const openDropdownState = "open";
const closeDropdownState = "close";const activeClass = true;
const px = (numberOf) => `${numberOf}px`;
const reactiveInvoke = (extensionAssignment, funcName, args) => {
    return extensionAssignment[funcName](...args);
};
const reactiveSet = (extensionAssignment, propertyName, value) => {
    extensionAssignment[propertyName] = value;
};
const openUI = (runtime, details) => runtime.emit(openUIEvent, details);
const registerButtonCallback = (runtime, buttonID, callback) => {
    runtime.emit(registerButtonCallbackEvent, buttonID);
    runtime.on(buttonID, callback);
};
/**
 * Makes it easier to reference the css color variables defined in prg-extension-boilerplate/packages/scratch-gui/src/components/programmatic-modal/programmatic-modal.jsx
 */
class CssVar {
    constructor(root) { this.root = root; }
    get(...parts) { return `var(--${this.root}-${parts.join("-")})`; }
    primary(...parts) { return this.get("primary", ...parts); }
    secondary(...parts) { return this.get("secondary", ...parts); }
    tertiary(...parts) { return this.get("tertiary", ...parts); }
    transparent(...parts) { return this.get("transparent", ...parts); }
    light(...parts) { return this.get("light", ...parts); }
}
const ui$1 = new CssVar("ui" /* Color.ui */);
const text = new CssVar("text" /* Color.text */);
const motion = new CssVar("motion" /* Color.motion */);
const red = new CssVar("red" /* Color.red */);
const sound = new CssVar("sound" /* Color.sound */);
const control = new CssVar("control" /* Color.control */);
const data = new CssVar("data" /* Color.data */);
const pen = new CssVar("pen" /* Color.pen */);
const error = new CssVar("error" /* Color.error */);
const extensions = new CssVar("extensions" /* Color.extensions */);
const drop = new CssVar("extensions" /* Color.extensions */);
/**
 * Color variable references corresponding to the css variables defined in prg-extension-boilerplate/packages/scratch-gui/src/components/programmatic-modal/programmatic-modal.jsx
 */
const color$1 = {
    "ui": {
        primary: ui$1.primary(),
        secondary: ui$1.secondary(),
        tertiary: ui$1.tertiary(),
        modalOverlay: ui$1.get("modal", "overlay"),
        white: ui$1.get("white"),
        whiteDim: ui$1.get("white", "dim"),
        whiteTransparent: ui$1.get("white", "transparent"),
        transparent: ui$1.transparent(),
        blackTransparent: ui$1.get("black", "transparent"),
    },
    "text": {
        primary: text.primary(),
        primaryTransparent: text.transparent(),
    },
    "motion": {
        primary: motion.primary(),
        tertiary: motion.tertiary(),
        transparent: motion.get("transparent"),
        lightTansparent: motion.light("transparent"),
    },
    "red": {
        primary: red.primary(),
        tertiary: red.tertiary(),
    },
    "sound": {
        primary: sound.primary(),
        tertiary: sound.tertiary(),
    },
    "control": {
        primary: control.primary(),
    },
    "data": {
        primary: data.primary(),
    },
    "pen": {
        primary: pen.primary(),
        transparent: pen.transparent(),
    },
    "error": {
        primary: error.primary(),
        light: error.light(),
        transparent: error.transparent(),
    },
    "extensions": {
        primary: extensions.primary(),
        tertiary: extensions.tertiary(),
        light: extensions.light(),
        transparent: extensions.transparent(),
    },
    "drop": {
        highlight: drop.get("highlight")
    }
};const validRegEx = new RegExp('^[a-z0-9]+$', 'i');
const invalidRegEx = new RegExp('[^a-z0-9]+', 'gi');
const isValidID = (id) => validRegEx.test(id);
const guard = 'prg';
const guards = [guard, guard.split("").reverse().join("")];
const guardsRegEx = new RegExp(`${guards[0]}([0-9]+)${guards[1]}`, 'g');
const wrap = (str) => `${guards[0]}${str}${guards[1]}`;
const replaceAll = (query, current, desired) => query.replaceAll(current, desired);
const encode = (query) => {
    const matches = [...query.matchAll(invalidRegEx)];
    const invalidCharacters = matches.reduce((set, current) => {
        current[0].split("").forEach(char => set.add(char));
        return set;
    }, new Set());
    const replacements = [...invalidCharacters].map(char => ({ char, code: char.charCodeAt(0) }));
    return replacements.reduce((modified, { char, code }) => replaceAll(modified, char, wrap(code)), `${query}`);
};
const decode = (query) => {
    const matches = [...query.matchAll(guardsRegEx)];
    const replacements = matches.reduce((replacements, match) => {
        const [key, code] = match;
        return replacements.set(key, String.fromCharCode(code));
    }, new Map());
    return [...replacements].reduce((modified, [current, desired]) => replaceAll(modified, current, desired), `${query}`);
};/**
 * WARNING! If you change this key, it will affect already saved projects.
 * Do not rename this without first developing a mechanism for searching for previously used keys.
 */
const saveDataKey = "customSaveDataPerExtension";
/**
 * @summary Utility class to assist in creating a (typesafe) object that, for a given Extension type, handles both:
 * - writing out data on save
 * - doing something with save data on load
 *
 * @description This class's constructor takes an object with both an `onSave` and an `onLoad` method
 * (and the `onSave`'s return type must match `onLoad`'s argument type)
 * @example
 * new SaveDataHandler({
 *    Extension: MyExtension,
 *    onSave: () => ({x: 0, y: 3}),
 *    onLoad: (data) => {
 *       const sum = data.x + data.y; // do something with saved data
 *    }
 * })
 * @todo Remove the `BaseGenericExtension` Generic Type restraint once Generic Extensions are no longer supported
 */
class SaveDataHandler {
    constructor(hooks) {
        this.hooks = hooks;
    }
}
/**
 * Mixin the ability for extensions to save and reload custom data (including any data related to custom arguments)
 * @param Ctor
 * @returns
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function mixin$1(Ctor) {
    class ExtensionWithCustomSaveDataSupport extends Ctor {
        constructor() {
            super(...arguments);
            /**
             * Optional field that can be defined if you need to save custom data for an extension
             * (like some extension specific variable, or an API endpoint).
             * @example
             * class Example extends Extension<..., ...> {
             *    someValue = 5;
             *    ...
             *    saveDataHandler = new SaveDataHandler({
             *      Extension: Example,
             *      // NOTE: The type info for 'instance' could be left off in the line below
             *      onSave: (instance: Example) => ({ valueToSave: instance.someValue }),
             *      onLoad: (instance, data) => instance.someValue = data.valueToSave
             *    })
             * }
             * @see Extension.MakeSaveDataHandler
             */
            this.saveDataHandler = undefined;
        }
        /**
         * Save function called 'internally' by the VM when serializing a project.
         * @param toSave
         * @param extensionIDs
         * @returns
         */
        save(toSave, extensionIDs) {
            const { saveDataHandler, id } = this;
            const argumentManager = this.supports("customArguments") ? this.customArgumentManager : null;
            const saveData = saveDataHandler?.hooks.onSave(this) ?? {};
            argumentManager?.saveTo(saveData);
            if (Object.keys(saveData).length === 0)
                return;
            const container = toSave[saveDataKey];
            container ? (container[id] = saveData) : (toSave[saveDataKey] = { [id]: saveData });
            extensionIDs.add(id);
        }
        /**
         * Load function called 'internally' by the VM when loading a project.
         * Will be invoked on an extension immediately after it is constructed.
         * @param saved
         * @returns
         */
        load(saved) {
            if (!saved)
                return;
            const { saveDataHandler, id } = this;
            const saveData = saveDataKey in saved ? saved[saveDataKey][id] : null;
            if (!saveData)
                return;
            saveDataHandler?.hooks.onLoad(this, saveData);
            if (this.supports("customArguments"))
                this.getOrCreateCustomArgumentManager().loadFrom(saveData);
        }
    }
    return ExtensionWithCustomSaveDataSupport;
}class Color$1 {
  /**
   * @typedef {object} RGBObject - An object representing a color in RGB format.
   * @property {number} r - the red component, in the range [0, 255].
   * @property {number} g - the green component, in the range [0, 255].
   * @property {number} b - the blue component, in the range [0, 255].
   */

  /**
   * @typedef {object} HSVObject - An object representing a color in HSV format.
   * @property {number} h - hue, in the range [0-359).
   * @property {number} s - saturation, in the range [0,1].
   * @property {number} v - value, in the range [0,1].
   */

  /** @type {RGBObject} */
  static get RGB_BLACK() {
    return {
      r: 0,
      g: 0,
      b: 0
    };
  }

  /** @type {RGBObject} */
  static get RGB_WHITE() {
    return {
      r: 255,
      g: 255,
      b: 255
    };
  }

  /**
   * Convert a Scratch decimal color to a hex string, #RRGGBB.
   * @param {number} decimal RGB color as a decimal.
   * @return {string} RGB color as #RRGGBB hex string.
   */
  static decimalToHex(decimal) {
    if (decimal < 0) {
      decimal += 0xFFFFFF + 1;
    }
    let hex = Number(decimal).toString(16);
    hex = `#${'000000'.substr(0, 6 - hex.length)}${hex}`;
    return hex;
  }

  /**
   * Convert a Scratch decimal color to an RGB color object.
   * @param {number} decimal RGB color as decimal.
   * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   */
  static decimalToRgb(decimal) {
    const a = decimal >> 24 & 0xFF;
    const r = decimal >> 16 & 0xFF;
    const g = decimal >> 8 & 0xFF;
    const b = decimal & 0xFF;
    return {
      r: r,
      g: g,
      b: b,
      a: a > 0 ? a : 255
    };
  }

  /**
   * Convert a hex color (e.g., F00, #03F, #0033FF) to an RGB color object.
   * CC-BY-SA Tim Down:
   * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
   * @param {!string} hex Hex representation of the color.
   * @return {RGBObject} null on failure, or rgb: {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   */
  static hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Convert an RGB color object to a hex color.
   * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   * @return {!string} Hex representation of the color.
   */
  static rgbToHex(rgb) {
    return Color$1.decimalToHex(Color$1.rgbToDecimal(rgb));
  }

  /**
   * Convert an RGB color object to a Scratch decimal color.
   * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   * @return {!number} Number representing the color.
   */
  static rgbToDecimal(rgb) {
    return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
  }

  /**
  * Convert a hex color (e.g., F00, #03F, #0033FF) to a decimal color number.
  * @param {!string} hex Hex representation of the color.
  * @return {!number} Number representing the color.
  */
  static hexToDecimal(hex) {
    return Color$1.rgbToDecimal(Color$1.hexToRgb(hex));
  }

  /**
   * Convert an HSV color to RGB format.
   * @param {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
   * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   */
  static hsvToRgb(hsv) {
    let h = hsv.h % 360;
    if (h < 0) h += 360;
    const s = Math.max(0, Math.min(hsv.s, 1));
    const v = Math.max(0, Math.min(hsv.v, 1));
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - s * f);
    const t = v * (1 - s * (1 - f));
    let r;
    let g;
    let b;
    switch (i) {
      default:
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    return {
      r: Math.floor(r * 255),
      g: Math.floor(g * 255),
      b: Math.floor(b * 255)
    };
  }

  /**
   * Convert an RGB color to HSV format.
   * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   * @return {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
   */
  static rgbToHsv(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const x = Math.min(Math.min(r, g), b);
    const v = Math.max(Math.max(r, g), b);

    // For grays, hue will be arbitrarily reported as zero. Otherwise, calculate
    let h = 0;
    let s = 0;
    if (x !== v) {
      const f = r === x ? g - b : g === x ? b - r : r - g;
      const i = r === x ? 3 : g === x ? 5 : 1;
      h = (i - f / (v - x)) * 60 % 360;
      s = (v - x) / v;
    }
    return {
      h: h,
      s: s,
      v: v
    };
  }

  /**
   * Linear interpolation between rgb0 and rgb1.
   * @param {RGBObject} rgb0 - the color corresponding to fraction1 <= 0.
   * @param {RGBObject} rgb1 - the color corresponding to fraction1 >= 1.
   * @param {number} fraction1 - the interpolation parameter. If this is 0.5, for example, mix the two colors equally.
   * @return {RGBObject} the interpolated color.
   */
  static mixRgb(rgb0, rgb1, fraction1) {
    if (fraction1 <= 0) return rgb0;
    if (fraction1 >= 1) return rgb1;
    const fraction0 = 1 - fraction1;
    return {
      r: fraction0 * rgb0.r + fraction1 * rgb1.r,
      g: fraction0 * rgb0.g + fraction1 * rgb1.g,
      b: fraction0 * rgb0.b + fraction1 * rgb1.b
    };
  }
}
var color = Color$1;const Color = color;

/**
 * @fileoverview
 * Utilities for casting and comparing Scratch data-types.
 * Scratch behaves slightly differently from JavaScript in many respects,
 * and these differences should be encapsulated below.
 * For example, in Scratch, add(1, join("hello", world")) -> 1.
 * This is because "hello world" is cast to 0.
 * In JavaScript, 1 + Number("hello" + "world") would give you NaN.
 * Use when coercing a value before computation.
 */

class Cast {
  /**
   * Scratch cast to number.
   * Treats NaN as 0.
   * In Scratch 2.0, this is captured by `interp.numArg.`
   * @param {*} value Value to cast to number.
   * @return {number} The Scratch-casted number value.
   */
  static toNumber(value) {
    // If value is already a number we don't need to coerce it with
    // Number().
    if (typeof value === 'number') {
      // Scratch treats NaN as 0, when needed as a number.
      // E.g., 0 + NaN -> 0.
      if (Number.isNaN(value)) {
        return 0;
      }
      return value;
    }
    const n = Number(value);
    if (Number.isNaN(n)) {
      // Scratch treats NaN as 0, when needed as a number.
      // E.g., 0 + NaN -> 0.
      return 0;
    }
    return n;
  }

  /**
   * Scratch cast to boolean.
   * In Scratch 2.0, this is captured by `interp.boolArg.`
   * Treats some string values differently from JavaScript.
   * @param {*} value Value to cast to boolean.
   * @return {boolean} The Scratch-casted boolean value.
   */
  static toBoolean(value) {
    // Already a boolean?
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      // These specific strings are treated as false in Scratch.
      if (value === '' || value === '0' || value.toLowerCase() === 'false') {
        return false;
      }
      // All other strings treated as true.
      return true;
    }
    // Coerce other values and numbers.
    return Boolean(value);
  }

  /**
   * Scratch cast to string.
   * @param {*} value Value to cast to string.
   * @return {string} The Scratch-casted string value.
   */
  static toString(value) {
    return String(value);
  }

  /**
   * Cast any Scratch argument to an RGB color array to be used for the renderer.
   * @param {*} value Value to convert to RGB color array.
   * @return {Array.<number>} [r,g,b], values between 0-255.
   */
  static toRgbColorList(value) {
    const color = Cast.toRgbColorObject(value);
    return [color.r, color.g, color.b];
  }

  /**
   * Cast any Scratch argument to an RGB color object to be used for the renderer.
   * @param {*} value Value to convert to RGB color object.
   * @return {import("../typescript-support/types").RGBObject} [r,g,b], values between 0-255.
   */
  static toRgbColorObject(value) {
    let color;
    if (typeof value === 'string' && value.substring(0, 1) === '#') {
      color = Color.hexToRgb(value);
      // If the color wasn't *actually* a hex color, cast to black
      if (!color) color = {
        r: 0,
        g: 0,
        b: 0,
        a: 255
      };
    } else {
      color = Color.decimalToRgb(Cast.toNumber(value));
    }
    return color;
  }

  /**
   * Determine if a Scratch argument is a white space string (or null / empty).
   * @param {*} val value to check.
   * @return {boolean} True if the argument is all white spaces or null / empty.
   */
  static isWhiteSpace(val) {
    return val === null || typeof val === 'string' && val.trim().length === 0;
  }

  /**
   * Compare two values, using Scratch cast, case-insensitive string compare, etc.
   * In Scratch 2.0, this is captured by `interp.compare.`
   * @param {*} v1 First value to compare.
   * @param {*} v2 Second value to compare.
   * @returns {number} Negative number if v1 < v2; 0 if equal; positive otherwise.
   */
  static compare(v1, v2) {
    let n1 = Number(v1);
    let n2 = Number(v2);
    if (n1 === 0 && Cast.isWhiteSpace(v1)) {
      n1 = NaN;
    } else if (n2 === 0 && Cast.isWhiteSpace(v2)) {
      n2 = NaN;
    }
    if (isNaN(n1) || isNaN(n2)) {
      // At least one argument can't be converted to a number.
      // Scratch compares strings as case insensitive.
      const s1 = String(v1).toLowerCase();
      const s2 = String(v2).toLowerCase();
      if (s1 < s2) {
        return -1;
      } else if (s1 > s2) {
        return 1;
      }
      return 0;
    }
    // Handle the special case of Infinity
    if (n1 === Infinity && n2 === Infinity || n1 === -Infinity && n2 === -Infinity) {
      return 0;
    }
    // Compare as numbers.
    return n1 - n2;
  }

  /**
   * Determine if a Scratch argument number represents a round integer.
   * @param {*} val Value to check.
   * @return {boolean} True if number looks like an integer.
   */
  static isInt(val) {
    // Values that are already numbers.
    if (typeof val === 'number') {
      if (isNaN(val)) {
        // NaN is considered an integer.
        return true;
      }
      // True if it's "round" (e.g., 2.0 and 2).
      return val === parseInt(val, 10);
    } else if (typeof val === 'boolean') {
      // `True` and `false` always represent integer after Scratch cast.
      return true;
    } else if (typeof val === 'string') {
      // If it contains a decimal point, don't consider it an int.
      return val.indexOf('.') < 0;
    }
    return false;
  }
  static get LIST_INVALID() {
    return 'INVALID';
  }
  static get LIST_ALL() {
    return 'ALL';
  }

  /**
   * Compute a 1-based index into a list, based on a Scratch argument.
   * Two special cases may be returned:
   * LIST_ALL: if the block is referring to all of the items in the list.
   * LIST_INVALID: if the index was invalid in any way.
   * @param {*} index Scratch arg, including 1-based numbers or special cases.
   * @param {number} length Length of the list.
   * @param {boolean} acceptAll Whether it should accept "all" or not.
   * @return {(number|string)} 1-based index for list, LIST_ALL, or LIST_INVALID.
   */
  static toListIndex(index, length, acceptAll) {
    if (typeof index !== 'number') {
      if (index === 'all') {
        return acceptAll ? Cast.LIST_ALL : Cast.LIST_INVALID;
      }
      if (index === 'last') {
        if (length > 0) {
          return length;
        }
        return Cast.LIST_INVALID;
      } else if (index === 'random' || index === 'any') {
        if (length > 0) {
          return 1 + Math.floor(Math.random() * length);
        }
        return Cast.LIST_INVALID;
      }
    }
    index = Math.floor(Cast.toNumber(index));
    if (index < 1 || index > length) {
      return Cast.LIST_INVALID;
    }
    return index;
  }
}
var cast = Cast;const castToType = (argumentType, value) => {
    switch (argumentType) {
        case ArgumentType.String:
            return `${value}`;
        case ArgumentType.Number:
            return parseFloat(value);
        case ArgumentType.Boolean:
            return JSON.parse(value ?? false);
        case ArgumentType.Note:
            return parseInt(value);
        case ArgumentType.Angle:
            return parseInt(value);
        case ArgumentType.Matrix:
            return toMatrix(value);
        case ArgumentType.Color:
            return cast.toRgbColorObject(value);
        default:
            throw new Error(`Method not implemented for value of ${value} and type ${argumentType}`);
    }
};
const tryCastToArgumentType = (argumentType, value, onFailure) => {
    try {
        const casted = castToType(argumentType, value);
        return casted;
    }
    catch {
        return onFailure(value);
    }
};
const toFlag = (value) => parseInt(value) === 1;
const toMatrix = (matrixString) => {
    if (matrixString.length !== 25)
        return new Array(5).fill(new Array(5).fill(false));
    const entries = matrixString.split('');
    const matrix = entries.map(toFlag).reduce((matrix, flag, index) => {
        const row = Math.floor(index / 5);
        const column = index % 5;
        (column === 0) ? matrix[row] = [flag] : matrix[row].push(flag);
        return matrix;
    }, new Array(5));
    return matrix;
};class CustomArgumentManager {
    constructor() {
        this.map = new Map();
        this.pending = null;
    }
    clearPending() { this.pending = null; }
    setPending(update) { this.pending = update; }
    add(entry) {
        const id = CustomArgumentManager.GetIdentifier();
        this.map.set(id, entry);
        this.clearPending();
        return id;
    }
    insert(id, entry) {
        this.map.set(id, entry);
        this.clearPending();
        return id;
    }
    request() {
        this.clearPending();
        const id = CustomArgumentManager.GetIdentifier();
        return [id, (entry) => this.setPending({ id, entry })];
    }
    tryResolve() {
        if (!this.pending)
            return;
        const { pending: { entry, id } } = this;
        this.map.set(id, entry);
        this.clearPending();
        return { entry, id };
    }
    getCurrentEntries() {
        return Array.from(this.map.entries())
            .filter(([_, entry]) => entry !== null)
            .map(([id, { text }]) => [text, id]);
    }
    getEntry(id) { return this.map.get(id); }
    requiresSave() { this.map.size > 0; }
    saveTo(obj) {
        const entries = Array.from(this.map.entries())
            .filter(([_, entry]) => entry !== null)
            .map(([id, entry]) => ({ id, entry }));
        if (entries.length === 0)
            return;
        obj[CustomArgumentManager.SaveKey] = entries;
    }
    loadFrom(obj) {
        obj[CustomArgumentManager.SaveKey]?.forEach(({ id, entry }) => {
            this.map.set(id, entry);
        });
    }
    /**
     * @todo Implement this if it becomes necessary (i.e the every growing size of this.map becomes an issue)
     */
    purgeStaleIDs() {
        // Somehow, tap into blockly to loop through all current blocks & their field dropdowns.
        // Collect all field dropdowns values. 
        // Then, loop over entries in this.map -- if the values don't appear in the collected in-use values, drop those items.
        // NOTE: The blocks in the 'pallette' do not show up in a target's "blocks" object, which makes this tricky.
    }
}
CustomArgumentManager.SaveKey = "internal_customArgumentsSaveData";
CustomArgumentManager.IsIdentifier = (query) => query.startsWith(CustomArgumentManager.IdentifierPrefix);
CustomArgumentManager.GetIdentifier = () => CustomArgumentManager.IdentifierPrefix + new Date().getTime().toString();
CustomArgumentManager.IdentifierPrefix = "__customArg__";const renderToDropdown = async (compononentConstructor, props) => {
    const dropdownContainerClass = "blocklyDropDownContent";
    const elements = document.getElementsByClassName(dropdownContainerClass);
    if (elements.length !== 1)
        return console.error(`Uh oh! Expected 1 element with class '${dropdownContainerClass}', but found ${elements.length}`);
    const [target] = elements;
    const anchor = await untilObject(() => target.children[0]);
    new compononentConstructor({ target, anchor, props });
    centerDropdownButton(anchor);
};
const centerDropdownButton = (container) => {
    const findElementAndModifyStyle = ([className, styleMod]) => {
        const elements = container.getElementsByClassName(className);
        console.assert(elements.length === 1, `Incorrect number of elements found with class: ${className}`);
        styleMod(elements[0].style);
    };
    const elements = [
        [
            "goog-menuitem goog-option",
            (style) => {
                style.margin = "auto";
                style.paddingLeft = style.paddingRight = "0px";
            }
        ],
        [
            "goog-menuitem-content",
            (style) => style.textAlign = "center"
        ]
    ];
    elements.forEach(findElementAndModifyStyle);
};/**
 * Class adapted from: https://github.com/LLK/scratch-svg-renderer/blob/develop/src/bitmap-adapter.js
 */
class MockBitmapAdapter {
    makeImage() { return new Image(); }
    makeCanvas() { return document.createElement('canvas'); }
    /**
     * Return a canvas with the resized version of the given image, done using nearest-neighbor interpolation
     * @param {CanvasImageSource} image The image to resize
     * @param {int} newWidth The desired post-resize width of the image
     * @param {int} newHeight The desired post-resize height of the image
     * @returns {HTMLCanvasElement} A canvas with the resized image drawn on it.
     */
    resize(image, newWidth, newHeight) {
        // We want to always resize using nearest-neighbor interpolation. However, canvas implementations are free to
        // use linear interpolation (or other "smooth" interpolation methods) when downscaling:
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1360415
        // It seems we can get around this by resizing in two steps: first width, then height. This will always result
        // in nearest-neighbor interpolation, even when downscaling.
        const stretchWidthCanvas = this.makeCanvas();
        stretchWidthCanvas.width = newWidth;
        stretchWidthCanvas.height = image.height;
        let context = stretchWidthCanvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        context.drawImage(image, 0, 0, stretchWidthCanvas.width, stretchWidthCanvas.height);
        const stretchHeightCanvas = this.makeCanvas();
        stretchHeightCanvas.width = newWidth;
        stretchHeightCanvas.height = newHeight;
        context = stretchHeightCanvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        context.drawImage(stretchWidthCanvas, 0, 0, stretchHeightCanvas.width, stretchHeightCanvas.height);
        return stretchHeightCanvas;
    }
    /**
     * Scratch 2.0 had resolution 1 and 2 bitmaps. All bitmaps in Scratch 3.0 are equivalent
     * to resolution 2 bitmaps. Therefore, converting a resolution 1 bitmap means doubling
     * it in width and height.
     * @param {!string} dataURI Base 64 encoded image data of the bitmap
     * @param {!function} callback Node-style callback that returns updated dataURI if conversion succeeded
     */
    convertResolution1Bitmap(dataURI, callback) {
        const image = new Image();
        image.src = dataURI;
        image.onload = () => {
            callback(null, this.resize(image, image.width * 2, image.height * 2).toDataURL());
        };
        image.onerror = () => {
            callback('Image load failed');
        };
    }
    /**
     * Given width/height of an uploaded item, return width/height the image will be resized
     * to in Scratch 3.0
     * @param {!number} oldWidth original width
     * @param {!number} oldHeight original height
     * @return {object} Array of new width, new height
     */
    getResizedWidthHeight(oldWidth, oldHeight) {
        const STAGE_WIDTH = 480;
        const STAGE_HEIGHT = 360;
        const STAGE_RATIO = STAGE_WIDTH / STAGE_HEIGHT;
        // If both dimensions are smaller than or equal to corresponding stage dimension,
        // double both dimensions
        if ((oldWidth <= STAGE_WIDTH) && (oldHeight <= STAGE_HEIGHT)) {
            return { width: oldWidth * 2, height: oldHeight * 2 };
        }
        // If neither dimension is larger than 2x corresponding stage dimension,
        // this is an in-between image, return it as is
        if ((oldWidth <= STAGE_WIDTH * 2) && (oldHeight <= STAGE_HEIGHT * 2)) {
            return { width: oldWidth, height: oldHeight };
        }
        const imageRatio = oldWidth / oldHeight;
        // Otherwise, figure out how to resize
        if (imageRatio >= STAGE_RATIO) {
            // Wide Image
            return { width: STAGE_WIDTH * 2, height: STAGE_WIDTH * 2 / imageRatio };
        }
        // In this case we have either:
        // - A wide image, but not with as big a ratio between width and height,
        // making it so that fitting the width to double stage size would leave
        // the height too big to fit in double the stage height
        // - A square image that's still larger than the double at least
        // one of the stage dimensions, so pick the smaller of the two dimensions (to fit)
        // - A tall image
        // In any of these cases, resize the image to fit the height to double the stage height
        return { width: STAGE_HEIGHT * 2 * imageRatio, height: STAGE_HEIGHT * 2 };
    }
    /**
     * Given bitmap data, resize as necessary.
     * @param {string} fileData Base 64 encoded image data of the bitmap
     * @param {string} fileType The MIME type of this file
     * @returns {Promise} Resolves to resized image data Uint8Array
     */
    importBitmap(dataURI) {
        return new Promise((resolve, reject) => {
            const image = this.makeImage();
            image.src = dataURI;
            image.onload = () => {
                const newSize = this.getResizedWidthHeight(image.width, image.height);
                if (newSize.width === image.width && newSize.height === image.height) {
                    // No change
                    resolve(this.convertDataURIToBinary(dataURI));
                }
                else {
                    const resizedDataURI = this.resize(image, newSize.width, newSize.height).toDataURL();
                    resolve(this.convertDataURIToBinary(resizedDataURI));
                }
            };
            image.onerror = () => {
                reject('Image load failed');
            };
        });
    }
    // TODO consolidate with scratch-vm/src/util/base64-util.js
    // From https://gist.github.com/borismus/1032746
    convertDataURIToBinary(dataURI) {
        const BASE64_MARKER = ';base64,';
        const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        const base64 = dataURI.substring(base64Index);
        const raw = window.atob(base64);
        const rawLength = raw.length;
        const array = new Uint8Array(new ArrayBuffer(rawLength));
        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }
}const getUrlHelper = (dimensions) => {
    const canvas = document.body.appendChild(document.createElement("canvas"));
    const setDimensions = ({ width, height }) => {
        if (canvas.width !== width)
            canvas.width = width;
        if (canvas.height !== height)
            canvas.height = height;
    };
    setDimensions(dimensions);
    canvas.hidden = true;
    const context = canvas.getContext("2d");
    return {
        /**
         *
         * @param image
         * @returns
         */
        getDataURL(image) {
            const { width, height } = image;
            setDimensions(image);
            context.save();
            context.clearRect(0, 0, width, height);
            context.putImageData(image, 0, 0);
            const url = canvas.toDataURL('image/png');
            context.restore();
            return url;
        }
    };
};let bitmapAdapter;
let urlHelper;
const rendererKey = "renderer";
const isRenderedTarget = (target) => rendererKey in target;
/**
 * Mixin the ability for extensions to add costumes to sprites
 * @param Ctor
 * @returns
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function addCostumes (Ctor) {
    class ExtensionWithCustomSupport extends Ctor {
        /**
         * Add a costume to the current sprite based on same image data
         * @param {RenderedTarget} target (e.g. `util.target`)
         * @param {ImageData} image What image to use to create the costume
         * @param {"add only" | "add and set"} action What action should be applied
         * - **_add only_**: generates the costume and append it it to the sprite's costume library
         * - **_add and set_**: Both generate the costume (adding it to the sprite's costume library) and set it as the sprite's current costume
         * @param {string?} name optional name to attach to the costume
         */
        async addCostume(target, image, action, name) {
            if (!isRenderedTarget(target))
                return console.warn("Costume could not be added is the supplied target wasn't a rendered target");
            name ?? (name = `${this.id}_generated_${Date.now()}`);
            bitmapAdapter ?? (bitmapAdapter = new MockBitmapAdapter());
            urlHelper ?? (urlHelper = getUrlHelper(image));
            // storage is of type: https://github.com/LLK/scratch-storage/blob/develop/src/ScratchStorage.js
            const { storage } = this.runtime;
            const dataFormat = storage.DataFormat.PNG;
            const assetType = storage.AssetType.ImageBitmap;
            const dataBuffer = await bitmapAdapter.importBitmap(urlHelper.getDataURL(image));
            const asset = storage.createAsset(assetType, dataFormat, dataBuffer, null, true);
            const { assetId } = asset;
            const costume = { name, dataFormat, asset, md5: `${assetId}.${dataFormat}`, assetId };
            await this.runtime.addCostume(costume);
            const { length } = target.getCostumes();
            target.addCostume(costume, length);
            if (action === "add and set")
                target.setCostume(length);
        }
    }
    return ExtensionWithCustomSupport;
}const dependencyListeners = [];
const withDependencies = (Ctor, ...dependencies) => {
    dependencyListeners.pop()?.(dependencies);
    return Ctor;
};
let mixinsMap;
const tryCaptureDependencies = (createMixin) => {
    mixinsMap ?? (mixinsMap = Object.entries(optionalMixins).reduce((map, [name, mixin]) => {
        return map.set(mixin, name);
    }, new Map()));
    let dependencies;
    dependencyListeners.push((mixins) => {
        mixins
            .map(dependency => dependency)
            .forEach(dependency => {
            if (!mixinsMap.has(dependency))
                throw new Error("Unkown mixin dependency! " + dependency);
            dependencies ?? (dependencies = []);
            dependencies.push(mixinsMap.get(dependency));
        });
    });
    const MixedIn = createMixin();
    return { dependencies, MixedIn };
};const callingContext = {
    DrowpdownOpen: openDropdownState,
    DropdownClose: closeDropdownState,
    Init: initDropdownState,
};
/**
 * Mixin the ability for extensions to create custom argument types with their own specific UIs
 * @param Ctor
 * @returns
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function mixin(Ctor) {
    class ExtensionWithCustomArgumentSupport extends withDependencies(Ctor, mixin$1) {
        constructor() {
            super(...arguments);
            /**
             * Create a custom argument for one of this block's arguments
             * @param param0
             * - component: The svelte component to render the custom argument UI
             * - initial: The starting value of the the custom argument (including both its value and text representation)
             * - acceptReportersHandler: A function that must be defined if you'd like for your custom argument to accept reporters
             * @returns
             */
            this.makeCustomArgument = ({ component, initial, acceptReportersHandler: handler }) => {
                this.argumentManager ?? (this.argumentManager = new CustomArgumentManager());
                const id = this.argumentManager.add(initial);
                const getItems = () => [{ text: customArgumentFlag, value: JSON.stringify({ component, id }) }];
                return {
                    type: ArgumentType.Custom,
                    defaultValue: id,
                    options: handler === undefined ? getItems : { acceptsReports: true, getItems, handler },
                };
            };
            this.argumentManager = null;
        }
        get customArgumentManager() {
            return this.argumentManager;
        }
        getOrCreateCustomArgumentManager() {
            this.argumentManager ?? (this.argumentManager = new CustomArgumentManager());
            return this.argumentManager;
        }
        /**
         * Utilized externally by scratch-vm to check if a given argument should be treated as a 'custom argument'.
         * Checks if the value returned by a dyanmic menu indicates that it should be treated as a 'custom argument'
         */
        [customArgumentCheck](arr) {
            if (arr.length !== 1)
                return false;
            const item = arr[0];
            if (typeof item !== "object")
                return false;
            const { text } = item;
            return text === customArgumentFlag;
        }
        ;
        /**
         * Utilized externally by scratch-vm to process custom arguments
         * @param runtime NOTE: once we switch to V2, we can remove this and instead use the extension's runtime
         * @param param1
         * @param getComponent
         * @returns
         */
        processCustomArgumentHack(runtime, [{ value }], getComponent) {
            const { id: extensionID, customArgumentManager: argumentManager } = this;
            const { component, id: initialID } = JSON.parse(value);
            const context = runtime[dropdownStateFlag];
            switch (context) {
                case callingContext.Init:
                    return argumentManager.getCurrentEntries();
                case callingContext.DropdownClose: {
                    const result = argumentManager.tryResolve();
                    return result ? [[result.entry.text, result.id]] : argumentManager.getCurrentEntries();
                }
                case callingContext.DrowpdownOpen: {
                    const currentEntry = runtime[dropdownEntryFlag];
                    const prevID = currentEntry?.value ?? initialID;
                    const current = argumentManager.getEntry(prevID);
                    const [id, setEntry] = argumentManager.request();
                    renderToDropdown(getComponent(extensionID, component), { setter: setEntry, current, extension: this });
                    return [["Apply", id]];
                }
            }
            throw new Error("Error during processing -- Context:" + callingContext);
        }
        ;
    }
    return ExtensionWithCustomArgumentSupport;
}/**
 * Mixin the ability for extensions to draw images into the canvas
 * @param Ctor
 * @returns
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function drawable (Ctor) {
    class ExtensionWithDrawingSupport extends Ctor {
        /**
         * Draw an item on screen using image data
         * @param {ImageData | ImageBitmap} image
         * @returns
         */
        createDrawable(image) {
            this.renderer ?? (this.renderer = this.runtime.renderer);
            const { renderer } = this;
            if (!renderer)
                return null;
            const skin = renderer.createBitmapSkin(image, 1);
            const drawable = renderer.createDrawable(StageLayering.VideoLayer);
            renderer.updateDrawableSkinId(drawable, skin);
            const setTransparency = (transparency) => renderer.updateDrawableEffect(drawable, 'ghost', transparency);
            const setVisible = (visible = true) => renderer.updateDrawableVisible(drawable, visible);
            const update = (image) => renderer.updateBitmapSkin(skin, image, 1);
            const destroy = () => {
                setVisible(false);
                renderer.destroyDrawable(drawable, StageLayering.VideoLayer);
                renderer.destroySkin(skin);
            };
            setTransparency(0);
            setVisible(true);
            return { setTransparency, setVisible, update, destroy };
        }
    }
    return ExtensionWithDrawingSupport;
}const reporterItemsKey = "items";
const reporterItemsGetterKey = "getItems";
const menuProbe = {
    isSimpleStatic: (menu) => Array.isArray(menu),
    isSimpleDynamic: (menu) => isFunction(menu),
    isStaticWithReporters: (menu) => reporterItemsKey in menu,
    isDynamicWithReporters: (menu) => reporterItemsGetterKey in menu,
};
const getMenuName = (index) => `${index}`;
const convertMenuItemsToString = (item) => isPrimitive(item) ? `${item}` : { ...item, value: `${item.value}` };
const asStaticMenu = (items, acceptReporters) => ({
    acceptReporters,
    items: items
        .map(item => item /**TODO figure out how to format */)
        .map(convertMenuItemsToString)
});
const addOptionsAndGetMenuName = (options, menus) => {
    const alreadyAddedIndex = menus.indexOf(options);
    const menuIndex = alreadyAddedIndex >= 0 ? alreadyAddedIndex : menus.push(options) - 1;
    return `${getMenuName(menuIndex)}`;
};
const setMenu = (entry, options, menus) => options ? entry.menu = addOptionsAndGetMenuName(options, menus) : null;const format = (text, identifier, description) => {
    return text; // make use of formatMessage in the future
};
const isBlockGetter = (details) => isFunction(details);
const getButtonID = (id, opcode) => `${id}_${opcode}`;const isVerbose = (arg) => !isPrimitive(arg);
const handlerKey = 'handler';
const hasHandler = (options) => options && handlerKey in options;
const extractHandlers = (args) => args.map(element => {
    if (!isVerbose(element))
        return identity;
    const { options } = element;
    if (!hasHandler(options))
        return identity;
    return options.handler;
});const getArgName = (index) => `${index}`;
const getArgumentType = (arg) => isPrimitive(arg) ? arg : arg.type;
/**
 * Extract an array of args tied to a block
 * @param block
 * @returns An array of 0, 1, or 2+ args
 */
const extractArgs = (block) => {
    const argKey = "arg";
    const argsKey = "args";
    if (argKey in block && block[argKey])
        return [block.arg];
    if (argsKey in block && (block[argsKey]?.length ?? 0) > 0)
        return block.args;
    return [];
};
/**
 * Combine arguments' type, name, and handler information into a single structure
 * @param args
 * @param names
 * @returns
 */
const zipArgs = (args, names) => {
    const types = args.map(getArgumentType);
    const handlers = extractHandlers(args);
    names ?? (names = types.map((_, index) => getArgName(index)));
    assertSameLength(types, handlers, names);
    return types.map((type, index) => ({ type, name: names[index], handler: handlers[index] }));
};
const convertToArgumentInfo = (opcode, args, menus) => {
    if (!args || args.length === 0)
        return undefined;
    return Object.fromEntries(args
        .map((element, index) => {
        const entry = {};
        entry.type = getArgumentType(element);
        if (isPrimitive(element))
            return entry;
        const { defaultValue, options } = element;
        setDefaultValue(entry, opcode, index, defaultValue);
        setMenu(entry, options, menus);
        return entry;
    })
        .reduce((accumulation, entry, index) => accumulation.set(getArgName(index), entry), new Map));
};
const getDefaultValue = (defaultValue, opcode, index) => isString(defaultValue)
    ? format(defaultValue)
    : defaultValue;
const setDefaultValue = (entry, opcode, index, defaultValue) => {
    if (defaultValue === undefined)
        return;
    entry.defaultValue = getDefaultValue(defaultValue);
};const isDynamicText = (text) => !isString(text);
const convertToDisplayText = (opcode, text, args) => {
    if (!args || args.length === 0)
        return text;
    if (!isDynamicText(text))
        return format(text);
    const textFunc = text;
    const argPlaceholders = args.map((_, index) => `[${getArgName(index)}]`);
    return format(textFunc(...argPlaceholders));
};const getImplementationName = (opcode) => `internal_${opcode}`;
/**
 * Wraps a blocks operation so that the arguments passed from Scratch are first extracted and then passed as indices in a parameter array.
 * @param _this What will be bound to the 'this' context of the underlying operation
 * @param operation The operation (function) to wrap
 * @param args The args that must be parsed before being passed to the underlying operation
 * @returns
 */
const wrapOperation = (_this, operation, args) => _this.supports("customArguments")
    ? function (argsFromScratch, blockUtility) {
        const castedArguments = args.map(({ name, type, handler }) => {
            const param = argsFromScratch[name];
            switch (type) {
                case ArgumentType.Custom:
                    const isIdentifier = isString(param) && CustomArgumentManager.IsIdentifier(param);
                    const value = isIdentifier ? this.customArgumentManager.getEntry(param).value : param;
                    return handler.call(_this, value);
                default:
                    return castToType(type, handler.call(_this, param));
            }
        });
        return operation.call(_this, ...castedArguments, blockUtility);
    }
    : function (argsFromScratch, blockUtility) {
        const castedArguments = args.map(({ name, type, handler }) => castToType(type, handler.call(_this, argsFromScratch[name])));
        return operation.call(_this, ...castedArguments, blockUtility);
    };
/**
 * Mixin the ability for extension's to:
 * - build up block definitions incrementally (through the use of `pushBlock`)
 * - implement a valid `getInfo` method that interacts with the scratch-vm correctly
 * @param Ctor
 * @returns
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function scratchInfo (Ctor) {
    class ScratchExtension extends Ctor {
        constructor() {
            super(...arguments);
            this.blockMap = new Map();
            this.menus = [];
        }
        /**
         * Add a block
         * @param opcode
         * @param definition
         * @param operation
         */
        pushBlock(opcode, definition, operation) {
            if (this.blockMap.has(opcode))
                throw new Error(`Attempt to push block with opcode ${opcode}, but it was already set. This is assumed to be a mistake.`);
            this.blockMap.set(opcode, { definition, operation });
        }
        getInfo() {
            if (!this.info) {
                const { id, name, blockIconURI } = this;
                const blocks = Array.from(this.blockMap.entries()).map(entry => this.convertToInfo(entry));
                this.info = { id, blocks, name, blockIconURI, menus: this.collectMenus() };
            }
            return this.info;
        }
        convertToInfo(details) {
            const [opcode, entry] = details;
            const { definition, operation } = entry;
            // Utilize explicit casting to appease test framework's typechecker
            const block = isBlockGetter(definition)
                ? typesafeCall(definition, this, this)
                : definition;
            const { type, text } = block;
            const args = extractArgs(block);
            const { id, runtime, menus } = this;
            const displayText = convertToDisplayText(opcode, text, args);
            const argumentsInfo = convertToArgumentInfo(opcode, args, menus);
            const info = { opcode, text: displayText, blockType: type, arguments: argumentsInfo };
            if (type === BlockType.Button) {
                const buttonID = getButtonID(id, opcode);
                registerButtonCallback(runtime, buttonID, operation.bind(this));
                info.func = buttonID;
            }
            else {
                const implementationName = getImplementationName(opcode);
                this[implementationName] = wrapOperation(this, operation, zipArgs(args));
            }
            return info;
        }
        collectMenus() {
            const { isSimpleStatic, isSimpleDynamic, isStaticWithReporters, isDynamicWithReporters } = menuProbe;
            return Object.fromEntries(this.menus
                .map((menu, index) => {
                if (isSimpleStatic(menu))
                    return asStaticMenu(menu, false);
                if (isSimpleDynamic(menu))
                    return this.registerDynamicMenu(menu, false, index);
                if (isStaticWithReporters(menu))
                    return asStaticMenu(menu.items, true);
                if (isDynamicWithReporters(menu))
                    return this.registerDynamicMenu(menu.getItems, true, index);
                throw new Error("Unable to process menu");
            })
                .reduce((map, menu, index) => map.set(getMenuName(index), menu), new Map()));
        }
        registerDynamicMenu(getItems, acceptReporters, menuIndex) {
            const key = `internal_dynamic_${menuIndex}`; // legacy support?
            this[key] = () => getItems.call(this).map(item => item).map(convertMenuItemsToString);
            return { acceptReporters, items: key };
        }
    }
    return ScratchExtension;
}/**
 * This a decorator function that should be associated with methods of your Extension class, all in order to turn your class methods
 * into Blocks that can be executed in the Block Programming Environment.
 * @param {BlockMetadata} blockInfoOrGetter Either an object or a function that returns an object of the following specified shapes
 * (which shape is required depends on your method's argument(s)):
 * @example
 * Block method accepts no arguments
 * ```ts
 * {
 *  type: BlockType, // e.g. "reporter", "command"
 *  text: string // the display text of your block
 * }
 * ```
 * @example
 * Block method accepts one argument
 * ```ts
 * {
 *  type: BlockType, // e.g. "reporter", "command"
 *  text: (arg) => string, // a function that returns a string, hover over the 'text' field in your code for more thourough documentation
 *  arg: Argument, // hover over the 'arg' field in your code for more thourough documentation
 * }
 * ```
* @example
 * Block method accepts 2 or more arguments
 * ```ts
 * {
 *  type: BlockType, // e.g. "reporter", "command"
 *  text: (...args) => string, // a function that returns a string, hover over the 'text' field in your code for more thourough documentation
 *  args: Argument[], // hover over the 'args' field in your code for more thourough documentation
 * }
 * ```
 * @returns A manipulated version of the original method that is
 */
function block(blockInfoOrGetter) {
    return function (target, context) {
        const opcode = target.name;
        const internalFuncName = getImplementationName(opcode);
        context.addInitializer(function () { this.pushBlock(opcode, blockInfoOrGetter, target); });
        return (function () { return this[internalFuncName].call(this, ...arguments); });
    };
}
/**
 * This is a short-hand for invoking the block command when your `blockType` is button
 * @param text
 * @returns
 * @see {@link block}
 * @example
 * // Ignore the leading "_"
 * _@buttonBlock("The text of button block")
 * buttonMethod() {
 *    this.openUI("someUI")
 * }
 *
 */
function buttonBlock(text) {
    return block({
        text,
        type: BlockType.Button
    });
}/**
 *
 * @param info
 * @param flags
 * @returns
 */
const legacy = (info, flags) => ({
    for() {
        const legacyExtension = () => (value, context) => {
            class LegacySupport extends legacySupportWithInfoArgument(value, info) {
                constructor() {
                    super(...arguments);
                    this.originalClassName = context.name;
                }
            }
            return LegacySupport;
        };
        const blockMethodBroker = getBlockMetaData(info).map(([opcode, entry]) => {
            const key = opcode;
            return {
                key,
                definer: createBlockDefiner(entry),
                decorator: createBlockDecorator(entry)
            };
        });
        const legacyDefinition = blockMethodBroker.reduce((definitions, { key, definer }) => {
            definitions[key] = definer; // TODO: See if we can get this type to work
            return definitions;
        }, {});
        const legacyBlock = blockMethodBroker.reduce((decorators, { key, decorator }) => {
            decorators[key] = decorator; // TODO: See if we can get this type to work
            return decorators;
        }, {});
        const throwTypeOnlyError = () => {
            throw new Error("This property is not meant to be accessed, and is instead solely for type inference / documentation purposes.");
        };
        return {
            legacyExtension, legacyDefinition, legacyBlock,
            ReservedNames: {
                get Menus() { return throwTypeOnlyError(); },
                get Blocks() { return throwTypeOnlyError(); },
                get ArgumentNamesByBlock() { return throwTypeOnlyError(); },
            },
        };
    }
});
/**
 * Creates a function that returns a function that acts as a block definition for the 'entry' block metadata.
 * @param entry
 * @returns
 */
const createBlockDefiner = (entry) => (objOrGetter) => ((extension) => {
    const { operation, argumentMethods } = isFunction(objOrGetter) ? objOrGetter.call(extension, extension) : objOrGetter;
    if (argumentMethods)
        attachArgumentMethods(entry, argumentMethods, extension);
    return { ...entry, operation };
});
/**
 * Creates a function that returns a decorator function that wraps the data contained within 'entry'.
 * @param entry
 * @returns
 */
const createBlockDecorator = (entry) => (...params) => {
    if (params.length === 0 || !params[0])
        return block(entry);
    const objOrGetter = params[0];
    return block((extension) => {
        const { argumentMethods } = isFunction(objOrGetter)
            ? objOrGetter.call(extension, extension) : objOrGetter;
        attachArgumentMethods(entry, argumentMethods, extension);
        return entry;
    });
};
const attachArgumentMethods = (block, argumentMethods, extension) => {
    const args = block.args ? block.args : block.arg ? [block.arg] : [];
    Object.entries(argumentMethods)
        .map(([indexKey, { handler, getItems }]) => {
        const arg = args[parseInt(indexKey)];
        return { arg, methods: { handler, getItems } };
    })
        .forEach(({ arg, methods }) => Object.entries(methods)
        .filter(([_, method]) => method)
        .map(([key, method]) => [key, method.bind(extension)])
        .forEach(([key, method]) => tryUpdateKey(arg.options, key, method)));
};
const tryUpdateKey = (obj, key, value) => {
    obj[key] = value;
};
const asBlockMetaData = (block) => {
    if (isString(block))
        throw new Error(`Block defined as string, unexpected! ${block}`);
    return block;
};
const convertAndInsertBlock = (map, block, metadata) => {
    const { opcode, arguments: _arguments, blockType: type } = block;
    const { text, orderedNames } = parseText(block);
    if (!_arguments)
        return map.set(opcode, { type, text });
    const args = Object.entries(_arguments ?? {})
        .map(([name, { menu, ...rest }]) => ({ options: extractMenuOptions(metadata, menu), name, menu, ...rest }))
        .sort(({ name: a }, { name: b }) => orderedNames.indexOf(a) < orderedNames.indexOf(b) ? -1 : 1)
        .map(({ name, ...details }) => details);
    const { length } = args;
    return length >= 2
        ? map.set(opcode, { type, text, args: args })
        : map.set(opcode, { type, text, arg: args[0] });
};
const getBlockMetaData = (metadata) => Array.from(metadata.blocks
    .map(asBlockMetaData)
    .reduce((map, block) => convertAndInsertBlock(map, block, metadata), new Map())
    .entries());
const parseText = ({ arguments: _arguments, text }) => {
    const placeholder = "Error: This should have been overridden by legacy support";
    if (!_arguments)
        return { orderedNames: null, text: placeholder };
    const args = Object.keys(_arguments)
        .map(name => ({ name, template: `[${name}]` }))
        .sort(({ template: a }, { template: b }) => text.indexOf(a) < text.indexOf(b) ? -1 : 1);
    return args.length === 0
        ? { orderedNames: null, text: placeholder }
        : { orderedNames: args.map(({ name }) => name), text: () => placeholder };
};
const getItemsPlaceholder = { getItems: () => "Error: This should have been filled in." };
const handlerPlaceholder = { handler: () => "Error: This should have been filled in." };
const isDynamicMenu = (menu) => isString(menu);
const extractMenuOptions = (data, menuName) => {
    const menu = menuName ? data.menus[menuName] : undefined;
    if (!menu)
        return undefined;
    if (isDynamicMenu(menu))
        return getItemsPlaceholder.getItems;
    const { items, acceptReporters: acceptsReporters } = menu;
    if (!isDynamicMenu(items))
        return acceptsReporters ? { acceptsReporters, items: [...items], ...handlerPlaceholder } : [...items];
    return acceptsReporters ? { acceptsReporters, ...handlerPlaceholder, ...getItemsPlaceholder } : getItemsPlaceholder.getItems;
};const validBlock = (legacyBlock, blockMap) => {
    if (isString(legacyBlock))
        throw new Error("Block was unexpectedly a string: " + legacyBlock);
    if (!blockMap.has(legacyBlock.opcode)) {
        console.error(`Could not find legacy opcode ${legacyBlock.opcode} within currently defined blocks`);
        return false;
    }
    return true;
};
const validArg = (pair) => {
    if (typeof pair.legacy.menu !== typeof pair.modern.menu)
        throw new Error("Menus don't match");
    return pair;
};
const getDynamicMenuName = (menu) => {
    if (isDynamicMenu(menu))
        return menu;
    if (isDynamicMenu(menu.items))
        return menu.items;
    throw new Error("Menu is not dynamic: " + menu);
};
/**
 * Mixin the ability for extensions to make use of 'legacy' `getInfo` json,
 * so that extensions ported to the framework can support old, serialized projects
 * @param Ctor
 * @param legacyInfo
 * @returns
 */
function legacySupportMixin(Ctor) {
    class ExtensionWithLegacySupport extends Ctor {
        constructor() {
            super(...arguments);
            this.__isLegacy = true;
            this.orderArgumentNamesByBlock = new Map();
            this.getArgNames = (legacyBlock) => {
                const { opcode } = legacyBlock;
                if (!this.orderArgumentNamesByBlock.has(opcode)) {
                    const { orderedNames } = parseText(legacyBlock);
                    this.orderArgumentNamesByBlock.set(opcode, orderedNames);
                }
                return this.orderArgumentNamesByBlock.get(opcode);
            };
        }
        getInfo() {
            if (!this.validatedInfo) {
                const info = super.getInfo();
                this.validatedInfo = this.validateAndAttach(info);
            }
            return this.validatedInfo;
        }
        validateAndAttach({ id, blocks, menus, ...metaData }) {
            const { id: legacyID, blocks: legacyBlocks, menus: legacyMenus } = this.getLegacyInfo();
            const mutableBlocks = [...blocks];
            if (id !== legacyID)
                throw new Error(`ID mismatch! Legacy id: ${legacyID} vs. current id: ${id}`);
            const blockMap = mutableBlocks.reduce((map, { opcode, ...block }, index) => map.set(opcode, { ...block, index }), new Map());
            const self = this;
            const updates = legacyBlocks
                .map(legacyBlock => validBlock(legacyBlock, blockMap) ? legacyBlock : undefined)
                .filter(Boolean)
                .map(legacyBlock => {
                const { opcode, arguments: legacyArgs } = legacyBlock;
                const { index, arguments: modernArgs } = blockMap.get(opcode);
                const argNames = this.getArgNames(legacyBlock);
                if (!argNames)
                    return { replaceAt: { index, block: legacyBlock } };
                const remapper = (args) => argNames.reduce((remap, current, index) => set(remap, index, args[current]), {});
                const implementation = this[getImplementationName(opcode)];
                this[opcode] = ((...[args, util]) => implementation.call(self, remapper(args), util)).bind(self);
                const menuUpdates = argNames
                    .map((legacyName, index) => ({ legacy: legacyArgs[legacyName], modern: modernArgs[index] }))
                    .map(validArg)
                    .map(({ legacy: { menu: legacyName }, modern: { menu: modernName } }) => ({ legacyName, modernName }))
                    .filter(menus => menus.legacyName && menus.modernName)
                    .map(({ legacyName, modernName }) => ({ legacyName, modernName, legacy: legacyMenus[legacyName], modern: menus[modernName] }))
                    .map(({ legacy, modern, legacyName, modernName }) => !isDynamicMenu(legacy) && !isDynamicMenu(legacy.items)
                    ? { type: "static", legacy: legacyName, modern: modernName }
                    : { type: "dynamic", legacy: legacyName, modern: modernName, methods: { legacy: getDynamicMenuName(legacy), modern: getDynamicMenuName(modern) } });
                return { menuUpdates, replaceAt: { index, block: legacyBlock } };
            });
            updates.forEach(({ replaceAt: { index, block } }) => mutableBlocks[index] = block);
            updates
                .map(({ menuUpdates }) => menuUpdates)
                .flat()
                .filter(Boolean)
                .map(menu => {
                const { legacy } = menu;
                if (legacy in menus)
                    throw new Error(`Somehow, there was already a menu called ${legacy}, which will cause issues in the next step.`);
                return menu;
            })
                .forEach(({ type, legacy, methods }) => {
                menus[legacy] = legacyMenus[legacy];
                if (type === "dynamic")
                    self[methods.legacy] = () => self[methods.modern]();
            });
            return {
                id, blocks: mutableBlocks, menus, ...metaData
            };
        }
    }
    return ExtensionWithLegacySupport;
}
/**
 * Mixin the ability for extensions to make use of 'legacy' `getInfo` json,
 * so that extensions ported to the framework can support old, serialized projects
 * @param Ctor
 * @param legacyInfo
 * @returns
 */
function legacySupportWithInfoArgument(Ctor, legacyInfo) {
    class ExtensionWithLegacySupport extends legacySupportMixin(Ctor) {
        getLegacyInfo() {
            return legacyInfo;
        }
    }
    return ExtensionWithLegacySupport;
}/**
 * Mixin the ability for extensions to open up UI at-will
 * @param Ctor
 * @returns
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function ui (Ctor) {
    class ExtensionWithUISupport extends Ctor {
        /**
         * Open a UI in a modal window
         * @param component The name of the svelte component / file to open (which should be stored within the same folder as your extension's `index.ts` file).
         * You can optionally leave off the `.svelte` extension.
         * @param label What to title the modal window that pops up (defaults to your extension's name if left blank)
         */
        openUI(component, label) {
            const { id, name, runtime } = this;
            openUI(runtime, { id, name, component: component.replace(".svelte", ""), label });
        }
    }
    return ExtensionWithUISupport;
}const Format = {
    image: "image-data",
    canvas: "canvas"
};
/**
 * Mixin the ability for extensions to interact with the user's web cam video feed
 * @param Ctor
 * @returns
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function video (Ctor) {
    class ExtensionWithVideoSupport extends Ctor {
        get video() {
            this.videoDevice ?? (this.videoDevice = this.runtime.ioDevices?.video);
            return this.videoDevice;
        }
        ;
        /**
         * Access the most recent frame captured by the web cam
         * @param {"image" | "canvas"} format
         * @returns
         */
        getVideoFrame(format) {
            return this.video?.getFrame({
                format: Format[format]
            });
        }
        setVideoTransparency(transparency) {
            this.video?.setPreviewGhost(transparency);
        }
        /**
         * Turn the video feed on so that it's frames can be accessed and the feed
         * diplays within the game window.
         */
        enableVideo() {
            this.video?.enableVideo();
        }
        /**
         * Disable the video feed
         */
        disableVideo() {
            this.video?.disableVideo();
        }
    }
    return ExtensionWithVideoSupport;
}/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind,
    key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _,
    done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function (f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? {
      get: descriptor.get,
      set: descriptor.set
    } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.push(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.push(_);else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
}
function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
}/**
 * Mixin a 'setVideoTransparencyBlock' to control the transparency of the videofeed
 * @param Ctor
 * @returns
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function setTransparencyBlock (Ctor) {
    let ExtensionWithSetTransparencyBlock = (() => {
        var _a;
        let _instanceExtraInitializers = [];
        let _setVideoTransparencyBlock_decorators;
        return _a = class ExtensionWithSetTransparencyBlock extends withDependencies(Ctor, video) {
                setVideoTransparencyBlock() {
                    console.log(Object.keys(this));
                    this.enableVideo();
                }
                constructor() {
                    super(...arguments);
                    __runInitializers(this, _instanceExtraInitializers);
                }
            },
            (() => {
                _setVideoTransparencyBlock_decorators = [block({
                        type: "button",
                        text: "",
                    })];
                __esDecorate(_a, null, _setVideoTransparencyBlock_decorators, { kind: "method", name: "setVideoTransparencyBlock", static: false, private: false, access: { has: obj => "setVideoTransparencyBlock" in obj, get: obj => obj.setVideoTransparencyBlock } }, null, _instanceExtraInitializers);
            })(),
            _a;
    })();
    return ExtensionWithSetTransparencyBlock;
}const optionalMixins = {
    customArguments: mixin,
    ui,
    customSaveData: mixin$1,
    video,
    drawable,
    addCostumes,
    legacySupport: legacySupportMixin,
    setTransparencyBlock
};class ConstructableExtension {
    async internal_init() {
        const runtime = this.runtime;
        return await Promise.resolve(this.init({
            runtime,
            get extensionManager() { return runtime.getExtensionManager(); }
        }));
    }
    /**
     *
     * @param runtime The 'runtime' connected to the scratch-vm that enables your extension to interact with the scratch workspace
     * @param name The name of this extension.
     * @param id The ID of this extension.
     * @param blockIconURI
     */
    constructor(runtime, name, id, blockIconURI) {
        this.runtime = runtime;
        this.name = name;
        this.id = id;
        this.blockIconURI = blockIconURI;
    }
}
const extensionsMap = new Map();
class ExtensionBase extends ConstructableExtension {
    constructor(FORBIDDEN) {
        // @ts-ignore
        super(...arguments);
        extensionsMap.set(this.id, this);
    }
}/**
 * Mixin the ability for extensions to check which optional mixins they support
 * @param Ctor
 * @returns
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
function supported (Ctor, supported) {
    class ExtensionWithConfigurableSupport extends Ctor {
        supports(mixinName) {
            return supported.includes(mixinName);
        }
    }
    return ExtensionWithConfigurableSupport;
}const registerDetailsIdentifier = "__registerMenuDetials";
const tryAnnounceDetails = (details) => {
    const isNode = typeof window === 'undefined';
    if (isNode)
        global?.[registerDetailsIdentifier]?.(details);
};
/**
 * Creates the base class that your Extension should 'extend' which is compatible with your request.
 *
 * Your request will have the following two parts:
 * @param details The details about how your extension should display and behave within the Extensions Menu.
 * Only the `name` field is required, but before your extension can be officially published,
 * it will additionally need a `description`, `iconURL`, and `insetIconURL`
 * @param addOns An optional collection of specifiers about what functionality this extension should have.
 * In this way, the functionality your Extension has access to (through its base class) is configurable.
 *
 * To see what `addOns` you can specify, place your cursor after the details parameter and type a double quote (").
 * Your IDE (code editor) should then suggest what values you can provide (e.g. `"ui"`, `"customArguments"`, `"customSaveData"`, etc.).
 *
 * **Note:** The order of the `addOns` does not matter.
 * @returns
 * @example Defining an extension with a name and description (and no add ons)
 * ```ts
 * export default class Example extends extension({ name: "Some Name", description: "Some description..." }) {
 *  ...
 * }
 * ```
 * @example Defining an extension with a name and UI functionality
 * ```ts
 * export default class Example extends extension({ name: "Some Name" }, "ui") {
 *  ...
 * }
 * ```
 * @example Defining an extension with a name and UI & custom arguments functionality
 * ```ts
 * export default class Example extends extension({ name: "Some Name" }, "ui", "customArguments") {
 *  ...
 * }
 * ```
 */
const extension = (details, ...addOns) => {
    tryAnnounceDetails(details);
    const Base = scratchInfo(supported(ExtensionBase, addOns));
    if (!addOns)
        return Base;
    const { Result, allSupported } = recursivelyApplyMixinsAndDependencies(Base, addOns);
    return supported(Result, Array.from(allSupported));
};
const recursivelyApplyMixinsAndDependencies = (Base, addons, alreadyAdded = new Set()) => {
    const Result = addons
        .filter(addon => !alreadyAdded.has(addon))
        .map(key => {
        alreadyAdded.add(key);
        return key;
    })
        .map(key => optionalMixins[key])
        .reduce((acc, mixin) => {
        const { dependencies, MixedIn } = tryCaptureDependencies(() => mixin(acc));
        return !dependencies
            ? MixedIn
            : recursivelyApplyMixinsAndDependencies(MixedIn, dependencies, alreadyAdded).Result;
    }, Base);
    return { Result, allSupported: alreadyAdded };
};
const registerExtensionDefinitionCallback = (callback) => global[registerDetailsIdentifier] = (details) => {
    if (!details)
        return;
    callback(details);
    delete global[registerDetailsIdentifier];
};/**
 * @summary Base class for extensions implemented via the Typescript Extension Framework (using the "generic" strategy).
 * @example
 * class MyExtension extends Extension<
 *  { // Display details
 *    name: "My Extension",
 *    description: "This is my extension",
 *    iconURL: "example.png",
 *    insetIconURL: "example.svg"
 *  },
 *  { // Blocks
 *    myBlock: (someArg: number) => void;
 *  }
 * > {
 *  init(env: Environment): { ... };
 *  defineBlocks(): MyExtension["BlockDefinitions"] { return ... }
 * }
 * @description Extension developers will create Typescript classes that `extend` (or 'inherit', or 'implement') this `Extension` class.
 *
 * In order to `extend` this class, you must first specify 2 generic type arguments, which effectively describe what kind of Extension you're implementing.
 *
 * More specifically, the 2 generic type arguments describe how this extension is presented to the user (by specifyng the details displayed in the Extensions Menu),
 * and what this Extension actually does (by specifying the blocks it will define).
 *
 * By declaring that we're extending an `Extension` with our specific generic type arguments,
 * Typescript holds us accountable to implement exactly what we said we would (all in order to make a working extension).
 *
 * This includes:
 * * Defining an `init` method, which is used INSTEAD of a constructor
 * * Defining a `defineBlocks` method that does just that: defines this extension's blocks
 * @template MenuDetails How the extension should display in the extensions menu
 * @template Blocks What kind of blocks this extension implements
 * @link https://www.typescriptlang.org/docs/handbook/2/generics.html Learn more about generics!
 */
class Extension extends extension(undefined, "ui", "customSaveData", "customArguments") {
    async internal_init() {
        await super.internal_init();
        const blocks = this.defineBlocks();
        const self = this;
        for (const opcode in blocks) {
            this.validateOpcode(opcode);
            const block = blocks[opcode];
            const { operation, text, arg, args, type } = isFunction(block) ? block.call(this, this) : block;
            this.pushBlock(opcode, arg
                ? { text, type, arg }
                : args
                    ? { text, type, args }
                    : { text, type }, operation);
            const internalFuncName = getImplementationName(opcode);
            this[opcode] = function () { return self[internalFuncName].call(self, ...arguments); };
        }
    }
    validateOpcode(opcode) {
        if (!(opcode in this))
            return;
        const error = `The Extension has a member defined as '${opcode}', ` +
            `but that name should be reserved for the opcode of the block with the same name. ` +
            `Please rename your member, and attach the "validateGenericExtension" decorator to your class ` +
            `so that this can be an error in your IDE and not at runtime.`;
        throw new Error(error);
    }
}/**
 * Used to validate (through type assertion) that a Generic Extension does not
 * define any members with the same name as one of its blocks.
 *
 * The Generic Extension `Extension` class predates this requirment of having no overlap between the keys of blocks and the members of the associated Extension
 * class, so this decorator is provided as an easy way to check and confirm a Generic Extension class is compliant.
 *
 * Runtime errors will also be produced if this condition is not met.
 * @param failure If this extension is not valid, this will be a type that displays the member names causing trouble.
 * @returns
 */
const validGenericExtension = (...failure) => {
    return function (value, context) { };
};exports.ArgumentType=ArgumentType;exports.BlockType=BlockType;exports.Branch=Branch;exports.ConstructableExtension=ConstructableExtension;exports.CustomArgumentManager=CustomArgumentManager;exports.Extension=Extension;exports.ExtensionBase=ExtensionBase;exports.FrameworkID=FrameworkID;exports.Language=Language;exports.LanguageKeys=LanguageKeys;exports.LayerGroups=LayerGroups;exports.RuntimeEvent=RuntimeEvent;exports.SaveDataHandler=SaveDataHandler;exports.ScratchBlocksConstants=ScratchBlocksConstants;exports.StageLayering=StageLayering;exports.TargetType=TargetType;exports.VariableType=VariableType;exports.activeClass=activeClass;exports.assertSameLength=assertSameLength;exports.block=block;exports.buttonBlock=buttonBlock;exports.castToType=castToType;exports.closeDropdownState=closeDropdownState;exports.color=color$1;exports.copyTo=copyTo;exports.customArgumentCheck=customArgumentCheck;exports.customArgumentFlag=customArgumentFlag;exports.decode=decode;exports.dropdownEntryFlag=dropdownEntryFlag;exports.dropdownStateFlag=dropdownStateFlag;exports.encode=encode;exports.extension=extension;exports.extensionsMap=extensionsMap;exports.fetchWithTimeout=fetchWithTimeout;exports.getTextFromMenuItem=getTextFromMenuItem;exports.getValueFromMenuItem=getValueFromMenuItem;exports.identity=identity;exports.initDropdownState=initDropdownState;exports.isDynamicMenu=isDynamicMenu;exports.isFunction=isFunction;exports.isPrimitive=isPrimitive;exports.isString=isString;exports.isValidID=isValidID;exports.legacy=legacy;exports.loadExternalScript=loadExternalScript;exports.openDropdownState=openDropdownState;exports.openUI=openUI;exports.openUIEvent=openUIEvent;exports.parseText=parseText;exports.px=px;exports.reactiveInvoke=reactiveInvoke;exports.reactiveSet=reactiveSet;exports.registerButtonCallback=registerButtonCallback;exports.registerButtonCallbackEvent=registerButtonCallbackEvent;exports.registerExtensionDefinitionCallback=registerExtensionDefinitionCallback;exports.renderToDropdown=renderToDropdown;exports.rgbToHex=rgbToHex;exports.saveDataKey=saveDataKey;exports.set=set;exports.splitOnCapitals=splitOnCapitals;exports.tryCastToArgumentType=tryCastToArgumentType;exports.typesafeCall=typesafeCall;exports.untilCondition=untilCondition;exports.untilExternalGlobalVariableLoaded=untilExternalGlobalVariableLoaded;exports.untilExternalScriptLoaded=untilExternalScriptLoaded;exports.untilObject=untilObject;exports.untilReady=untilReady;exports.untilTimePassed=untilTimePassed;exports.validGenericExtension=validGenericExtension;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({});//# sourceMappingURL=ExtensionFramework.js.map
