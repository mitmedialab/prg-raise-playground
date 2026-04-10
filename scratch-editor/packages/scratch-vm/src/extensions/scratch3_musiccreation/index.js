const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const BlockUtility = require('../../engine/block-utility');
const log = require('../../util/log');

const VizHelpers = require('./vizhelpers');
const MusicCreationHelpers = require('./musiccreationhelpers');
const MusicAccompanimentHelpers = require('./musicaccompanimenthelpers');
const MusicPlayers = require('./musicplayer')
const textRender = require('./textrender');
const regeneratorRuntime = require("regenerator-runtime"); //do not delete
const { generateXMLForBlockChunk } = require('../../extension-support/prg/xml-builder');
const { internalIDKey, addTopBlockModifier, getTopBlockModifier } = require('../../extension-support/prg/block-relationships');

const givenBeatValues = ["1/4", "1/2", "1", "2", "3", "4", "8"];
const instrumentModifierKey = 'instrument';
const maxNotesForCompleteGen = 20;
const volumeModifierKey = 'volume';

class Scratch3MusicCreation {
    constructor(runtime) {
        this.runtime = runtime;
        this.beats = givenBeatValues.map(this.beatsToSecs);

        // whole, whole, half, whole, whole, whole, half
        this.majorScale = [0, 2, 4, 5, 7, 9, 11, 12];

        // whole, half, whole, whole, half, whole, whole
        this.minorScale = [0, 2, 3, 5, 7, 8, 10, 12];

        // whole, whole, whole plus half, whole, whole plus half
        this.pentatonicScale = [0, 2, 4, 7, 9, 12];

        this.musicPlayer = new MusicPlayers(runtime);
        this.vizHelper = new VizHelpers(runtime);
        this.musicCreationHelper = new MusicCreationHelpers(runtime);
        const validNoteDurations = this.beats.map(item => parseFloat(item.value));
        const beatsPerSec = Scratch3MusicCreation.beatPerSec();
        this.musicAccompanimentHelper = new MusicAccompanimentHelpers(runtime, validNoteDurations, beatsPerSec);

        this.noteList = [];
        this.wavenoteList = [];
        this.magentaNoteList = [];

        this.volumes = [{ text: "pianissimo", value: '15' },
        { text: "piano", value: '30' },
        { text: "mezzo-piano", value: '45' },
        { text: "mezzo-forte", value: '60' },
        { text: "forte", value: '85' },
        { text: "fortissimo", value: '100' }];

        this.files = [{ text: "mystery 1", value: '1' },
        { text: "mystery 2", value: '2' },
        { text: "mystery 3", value: '3' },
        { text: "mystery 4", value: '4' },
        { text: "mystery 5", value: '5' },
        { text: "mystery 6", value: '6' }];

        this.displayOptions = [{ text: "sheet music", value: '1' },
        { text: "waveform", value: '2' },
        { text: "frequencies", value: '3' },
        { text: "frequencies over time", value: '4' }];

        this.createNotesRNNSettings = [{ text: "include", value: '1' },
        { text: "exclude", value: '0' }];

        this._visStatus = [{ text: "off", value: '0' },
        { text: "on", value: '1' }];

        this.textRenderer = new textRender(runtime);

        this._playNoteForPicker = this._playNoteForPicker.bind(this);
        this.runtime.on('PLAY_NOTE', this._playNoteForPicker);

        this._onTargetCreated = this._onTargetCreated.bind(this);
        this.runtime.on('targetWasCreated', this._onTargetCreated);
        this.runtime.setMaxListeners(Infinity);
    }


    /**
     * The key to load & store a target's music-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return 'Scratch.musiccreation';
    }

    /**
     * When a music-playing Target is cloned, clone the music state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated(newTarget, sourceTarget) {
        if (sourceTarget) {
            const musicState = sourceTarget.getCustomState(Scratch3MusicCreation.STATE_KEY);
            if (musicState) {
                newTarget.setCustomState(Scratch3MusicCreation.STATE_KEY, Clone.simple(musicState));
            }
        }
    }

    /**
     * Create data for a menu in scratch-blocks format, consisting of an array of objects with text and
     * value properties. The text is a translated string, and the value is one-indexed.
     * @param  {object[]} info - An array of info objects each having a name property.
     * @return {array} - An array of objects with text and value properties.
     * @private
     */
    _buildMenu(info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = String(index + 1);
            return obj;
        });
    }


    /**
     * An array of info about each instrument.
     * @type {object[]}
     * @param {string} name - the translatable name to display in the instruments menu.
     * @param {string} dirName - the name of the directory containing audio samples for this instrument.
     * @param {number} [releaseTime] - an optional duration for the release portion of each note.
     * @param {number[]} samples - an array of numbers representing the MIDI note number for each
     *                           sampled sound used to play this instrument.
     */
    get INSTRUMENT_INFO() {
        return [
            {
                name: formatMessage({
                    id: 'musiccreation.instrumentPiano',
                    default: 'Piano',
                    description: 'Sound of a piano'
                }),
                dirName: '1-piano',
                releaseTime: 0.5,
                samples: [24, 36, 48, 60, 72, 84, 96, 108]
            },
            {
                name: formatMessage({
                    id: 'musiccreation.instrumentGuitar',
                    default: 'Guitar',
                    description: 'Sound of an accoustic guitar'
                }),
                dirName: '4-guitar',
                releaseTime: 0.5,
                samples: [60]
            }, {
                name: formatMessage({
                    id: 'music.instrumentBass',
                    default: 'Bass',
                    description: 'Sound of an accoustic upright bass'
                }),
                dirName: '6-bass',
                releaseTime: 0.25,
                samples: [36, 48]
            },
            {
                name: formatMessage({
                    id: 'musiccreation.instrumentCello',
                    default: 'Cello',
                    description: 'Sound of a cello being played with a bow'
                }),
                dirName: '8-cello',
                releaseTime: 0.1,
                samples: [36, 48, 60]
            },
            {
                name: formatMessage({
                    id: 'musiccreation.instrumentSaxophone',
                    default: 'Saxophone',
                    description: 'Sound of a saxophone being played'
                }),
                dirName: '11-saxophone',
                samples: [36, 60, 84]
            },
            {
                name: formatMessage({
                    id: 'music.instrumentClarinet',
                    default: 'Clarinet',
                    description: 'Sound of a clarinet being played'
                }),
                dirName: '10-clarinet',
                samples: [48, 60]
            },
            {
                name: formatMessage({
                    id: 'musiccreation.instrumentSynthLead',
                    default: 'Synth',
                    description: 'Sound of a "lead" synthesizer being played'
                }),
                dirName: '20-synth-lead',
                releaseTime: 0.1,
                samples: [60]
            }
        ];
    }

    /**
     * Converts a numeric decimal representation to its fractional form stored in a string
     * @param {number} value 
     * @returns {string}
     */
    static convertDecimalToFraction(value) {
        const gcd = function (a, b) {
            if (b < 0.0000001) return a;// Since there is a limited precision we need to limit the value.
            return gcd(b, Math.floor(a % b));
        };

        const len = value.toString().length - 2;

        let denominator = Math.pow(10, len);
        let numerator = value * denominator;

        const divisor = gcd(numerator, denominator);

        numerator = Math.round(numerator / divisor);
        denominator = Math.round(denominator / divisor);


        return denominator === 1 ? `${numerator}` : `${numerator}/${denominator}`;
    }

    /**
     * Convert a fraction stored in a string to it's numeric decimal form
     * @param {string} value 
     * @returns {number}
     */
    static convertFractionToDecimal(value) {
        const parts = value.split("/");
        if (parts.length === 1) return parseInt(parts);
        return parseInt(parts[0], 10) / parseInt(parts[1], 10);
    }

    static beatPerSec() {
        return 2;
    };

    /**
     * Convert an amount of seconds into how many beats it is (assuming 4 beats per second)
     * @param {number | string} beats 
     * @param {number} beatPerSec
     * @returns {{text: string, value: number | string }} text represents the calculated number of beats, while value is still in seconds 
     */
    beatsToSecs(beats) {
        const ratio = Scratch3MusicCreation.beatPerSec();
        const secs = (typeof beats === 'number' ? beats : Scratch3MusicCreation.convertFractionToDecimal(beats)) / ratio;
        return { text: `${beats}`, value: `${secs}` };
    }

    /**
     * Convert an amount of seconds into how many beats it is (assuming 4 beats per second)
     * @param {number | string} secs 
     * @param {number} beatPerSec
     * @returns {{text: string, value: number | string }} text represents the calculated number of beats, while value is still in seconds 
     */
    secsToBeats(secs) {
        const ratio = Scratch3MusicCreation.beatPerSec();
        const beats = (typeof secs === 'number' ? secs : parseFloat(secs)) * ratio;
        return { text: Scratch3MusicCreation.convertDecimalToFraction(beats), value: secs };
    };


    getInfo() {
        return {
            id: 'musiccreation',
            name: 'Music Creation',
            blocks: [
                {
                    opcode: 'resetMusic',
                    blockType: BlockType.COMMAND,
                    text: 'reset music'
                },
                {
                    opcode: 'toggleVisMode',
                    blockType: BlockType.COMMAND,
                    text: 'set visualization mode to [STATUS] with [FORMAT]',
                    arguments: {
                        STATUS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '1',
                            menu: "STATUS"
                        },
                        FORMAT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '1',
                            menu: "FORMAT"
                        }
                    }
                },
                {
                    opcode: 'playNote',
                    blockType: BlockType.COMMAND,
                    text: 'play note [NOTE] for [SECS] beats',
                    arguments: {
                        NOTE: {
                            type: ArgumentType.NOTE,
                            defaultValue: 60
                        },
                        SECS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.5,
                            menu: "BEATS"
                        }
                    }
                },
                {
                    opcode: 'setInstrument',
                    blockType: BlockType.COMMAND,
                    text: 'set instrument to [INSTRUMENT]',
                    arguments: {
                        INSTRUMENT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            menu: "INSTRUMENT"
                        }
                    }
                },
                {
                    opcode: 'setInstrumentForBelow',
                    blockType: BlockType.COMMAND,
                    text: 'set instrument for below blocks to [INSTRUMENT]',
                    arguments: {
                        INSTRUMENT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            menu: "INSTRUMENT"
                        }
                    }
                },
                {
                    opcode: 'getInstrument',
                    text: formatMessage({
                        id: 'musiccreation.getInstrument',
                        default: 'instrument',
                        description: 'get the current instrument'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'setVolume',
                    blockType: BlockType.COMMAND,
                    text: 'set volume to [VOLUME]',
                    arguments: {
                        VOLUME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 60,
                            menu: "VOLUME"
                        }
                    }
                },
                {
                    opcode: 'setVolumeForBelow',
                    blockType: BlockType.COMMAND,
                    text: 'set volume for below blocks to [VOLUME]',
                    arguments: {
                        VOLUME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 60,
                            menu: "VOLUME"
                        }
                    }
                },
                {
                    opcode: 'getVolume',
                    text: formatMessage({
                        id: 'musiccreation.getVolume',
                        default: 'volume',
                        description: 'get the current volume'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'roundNoteToScale',
                    text: formatMessage({
                        id: 'musiccreation.toScaleNote',
                        default: 'Round [NOTE] to [SCALE] [TYPE] scale',
                        description: 'scale a note value to the closest note withing a given scale'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NOTE: {
                            type: ArgumentType.NOTE,
                            defaultValue: 60
                        },
                        SCALE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "0",
                            menu: "SCALE_NOTES"
                        },
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: "Major",
                            menu: "SCALE_TYPES"
                        }
                    }
                },
                {
                    opcode: 'playNoteList',
                    blockType: BlockType.COMMAND,
                    text: 'play notes [A][B][C] for [SECS] beats',
                    arguments: {
                        A: {
                            type: ArgumentType.NOTE,
                            defaultValue: 60
                        },
                        B: {
                            type: ArgumentType.NOTE,

                            defaultValue: 64
                        },
                        C: {
                            type: ArgumentType.NOTE,
                            defaultValue: 67
                        },
                        SECS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.5,
                            menu: "BEATS"
                        }
                    }
                },
                {
                    opcode: 'testMagentaRNN',
                    text: formatMessage({
                        id: 'musiccreation.testMagentaRNN',
                        default: 'complete music with [STEPS] steps and [TEMP] temperature',
                        description: 'test Magenta RNN'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        STEPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        },
                        TEMP: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1.5
                        },
                    },
                },
                {
                    opcode: 'createNotesRNN',
                    text: formatMessage({
                        id: 'musiccreation.createNotesRNN',
                        default: 'complete & add blocks for [STEPS] steps, [TEMP] temp., and [SETTING] blocks for input notes',
                        description: 'create notes Magenta MVAE'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        STEPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        },
                        TEMP: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1.5
                        },
                        SETTING: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            menu: 'SETTING'
                        }
                    }
                },
                {
                    opcode: 'testMagentaMVAE',
                    text: formatMessage({
                        id: 'musiccreation.testMagentaMVAE',
                        default: 'generate new music',
                        description: 'test Magenta MVAE'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'createNotesMVAE',
                    text: formatMessage({
                        id: 'musiccreation.createNotesMVAE',
                        default: 'add new music blocks',
                        description: 'create notes Magenta MVAE'
                    }),
                    blockType: BlockType.COMMAND
                },
            ],
            menus: {
                VOLUME: {
                    acceptReporters: true,
                    items: this.volumes
                },
                INSTRUMENT: {
                    acceptReporters: true,
                    items: this._buildMenu(this.INSTRUMENT_INFO)
                },
                FILES: {
                    acceptReporters: true,
                    items: this.files
                },
                BEATS: {
                    acceptReporters: true,
                    items: this.beats
                },
                FORMAT: {
                    acceptReporters: true,
                    items: this.displayOptions
                },
                STATUS: {
                    acceptReporters: true,
                    items: this._visStatus
                },
                SETTING: {
                    acceptReporters: false,
                    items: this.createNotesRNNSettings
                },
                SCALE_NOTES: {
                    acceptReporters: false,
                    items: [
                        { text: 'C', value: '0' },
                        { text: 'C#', value: '1' },
                        { text: 'D', value: '2' },
                        { text: 'D#', value: '3' },
                        { text: 'E', value: '4' },
                        { text: 'F', value: '5' },
                        { text: 'F#', value: '6' },
                        { text: 'G', value: '7' },
                        { text: 'G#', value: '8' },
                        { text: 'A', value: '9' },
                        { text: 'A#', value: '10' },
                        { text: 'B', value: '11' }]
                },
                SCALE_TYPES: {
                    acceptReporters: false,
                    items: ["Major", "Minor", "Pentatonic"]
                },
            }
        };
    }

    resetMusic(args, util) {
        this.noteList = [];
        this.wavenoteList = [];
        this.magentaNoteList = [];
        this.vizHelper.clearNoteBuffers();
        this.vizHelper.requestViz(null, util);
    }

    toggleVisMode(args, util) {
        this.vizHelper.toggleVisMode(args, util);
    }

    /**
     * Select an instrument for playing notes.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     * @property {int} INSTRUMENT - the number of the instrument to select.
     */
    setInstrument(args, util) {
        this.musicCreationHelper._setInstrument(args.INSTRUMENT, util, false);
    }

    /**
     * Select an instrument for playing notes.
     * @param {object} args - the block arguments.
     * @param {BlockUtility} util - utility object provided by the runtime.
     * @property {int} INSTRUMENT - the number of the instrument to select.
     */
    setInstrumentForBelow(args, util) {
        addTopBlockModifier(util, instrumentModifierKey, Cast.toNumber(args.INSTRUMENT) - 1); // instruments are one-indexed
    }

    setVolumeForBelow(args, util) {
        let vol_n = Cast.toNumber(args.VOLUME);
        addTopBlockModifier(util, volumeModifierKey, vol_n);
    }


    /**
     * 
     * @param {array} raw_note - magenta note [freq,duration,inst,volume] 
     * @returns information about the note as an object, in a form 
     *          consumable by this.musicCreationHelper
     */
    rawNoteToNoteArg(raw_note) {
        if (raw_note.length < 2) return;
        var note_num = String(raw_note[0]);
        var secs = String(raw_note[1]);
        return { mutation: undefined, NOTE: note_num, SECS: secs };
    }

    /**
     * Prepares the magenta notes to be played
     * @param {Array[]} magenta_notes 
     * @returns an object with 'notes' and 'args' fields
     */
    _prepare(magenta_notes) {
        var inst = this.getInstrument();
        magenta_notes.forEach(x => {
            x[2] = inst;
        });
        var args = magenta_notes.map(x => {
            return this.rawNoteToNoteArg(x);
        });
        return { notes: magenta_notes, args: args };
    }

    /**
     * 
     * @param {number} hi - highest freq. acceptable for Magenta RNN
     * @param {number} low - lowest freq. acceptable for Magenta RNN
     * @param {array} notes - array of notes that will be adjusted in-place
     */
    adjustFreqsToRange(hi, low, notes) {
        notes.map(
            (note) => {
                let freq = note[0];
                if (freq < low) {
                    const diff = low - freq;
                    note[0] += (Math.ceil(diff / 12.0) * 12);
                } else if (freq > hi) {
                    const diff = freq - hi;
                    note[0] -= (Math.ceil(diff / 12.0) * 12);
                }
            });
        return notes;
    }

    /**
     * Asynchronous function that gets the created notes from Magenta and initializes
     * playing the sequence.
     * @param {boolean} RNN - true if 'complete music', false if 'generate new music'
     * @param {array} args - arguments to be given to the music helper
     * @param {BlockUtility} utils
     * @param {number} inst - instrument to play on, represented as a number
     * @param {function({mutation: any; NOTE: string; SECS: string;}[]): void} processNotes A callback function invoked with the generated notes as an argument
     * @private 
     */
    async _getAndPlayMagentaNotes(RNN, args, utils, inst, vol, processNotes) {
        let magenta_notes = null;
        let valid = true;
        if (RNN) {
            if (this.noteList.length > 0) {
                const low = 48;
                const hi = 83;
                //copy the noteList so that it doesn't change
                const adjusted_notes = this.adjustFreqsToRange(hi, low, JSON.parse(JSON.stringify(this.noteList)));
                magenta_notes = await this.musicAccompanimentHelper.testMagentaRNN(adjusted_notes, args, utils);

            } else valid = false;
        } else {
            magenta_notes = await this.musicAccompanimentHelper.testMagentaMVAE(utils);
        }
        if (valid) {
            const prepared_notes = this._prepare(magenta_notes);
            this.magentaNoteList = prepared_notes['notes'];
            if (processNotes) processNotes(prepared_notes.args);
            this.musicCreationHelper.playNotes(prepared_notes, utils, inst, vol, this.vizHelper);
        } else utils.stackFrame.duration = 0;
    }


    getInstrumentForBlock(util) {
        const modifierInst = getTopBlockModifier(util, instrumentModifierKey);
        return (modifierInst !== undefined && modifierInst !== null) ? modifierInst : this.musicCreationHelper._getMusicState(util.target).currentInstrument;
    }

    getVolumeForBlock(util) {
        const modifierVol = getTopBlockModifier(util, volumeModifierKey);
        return modifierVol ? modifierVol : this.musicCreationHelper.findNumberForVolume(this.getVolume(util));
    }

    /**
     * Used to get the generated sequence of notes from Magenta and 
     * play it. 
     * @param {boolean} RNN - true if 'complete music', false if 'generate new music'
     * @param {array} args - arguments to be given to the music helper
     * @param {BlockUtility} utils
     * @param {function(any[][]): void} processNotes
     */
    getAndPlayMagentaNotes(RNN, args, util, processNotes) {
        const inst = this.getInstrumentForBlock(util);
        const vol = this.getVolumeForBlock(util);
        if (util.stackTimerNeedsInit()) {
            // get timer running for a large amount of time (will be handled)
            util.startStackTimer(Number.MAX_SAFE_INTEGER);
            util.yield();
            this._getAndPlayMagentaNotes(RNN, args, util, inst, vol, processNotes);
        }
        else if (!util.stackTimerFinished()) {
            util.yield();
        }
    }

    /**
     * Generates and plays a sequence of notes based off of the notes
     * that have recently been played and the current instrument
     * @param {array} args - array of magenta notes [freq,duration,inst,?] 
     * @param {BlockUtility} utils 
     */
    testMagentaRNN(args, utils) {
        this.getAndPlayMagentaNotes(true, args, utils);
    }

    /**
     * Generates and plays a sequence of notes, using the 
     * current instrument. 
     * @param {array} args - array of magenta notes [freq,duration,inst,?] 
     * @param {BlockUtility} utils 
     */
    testMagentaMVAE(args, utils) {
        this.getAndPlayMagentaNotes(false, args, utils);
    }

    /**
     *  
     * current instrument. 
     * @param {array} args - array of magenta notes [freq,duration,inst,?] 
     * @param {BlockUtility} utils 
     */
    createNotesMVAE(args, utils) {
        const { runtime } = utils
        this.getAndPlayMagentaNotes(false, args, utils, (notes) => {
            const blockArgs = notes.map(note => {
                const { NOTE, SECS } = note;
                return { NOTE, SECS: `${SECS}` };
            });
            const opcodes = blockArgs.map(_ => 'playNote');
            const xml = generateXMLForBlockChunk(this, runtime, opcodes, blockArgs);
            runtime.addBlocksToWorkspace(xml);
        });
    }

    createNotesRNN(args, utils) {
        const { runtime } = utils;
        this.getAndPlayMagentaNotes(true, args, utils, (notes) => {
            let blockArgs = notes.map(note => {
                const { NOTE, SECS } = note;
                return { NOTE, SECS: `${SECS}` };
            });

            const includeOldNotes = Cast.toBoolean(args.SETTING);
            if (includeOldNotes) {
                const oldNotes = this.noteList
                    .map(note => { return { NOTE: Cast.toString(note[0]), SECS: Cast.toString(note[1]) } })
                    .slice(-maxNotesForCompleteGen); //limit number of notes included in the generated chunk
                if (this.noteList.length > maxNotesForCompleteGen) {
                    alert(`Only displaying the last ${maxNotesForCompleteGen} notes in the generated chunk of blocks. Press 'reset music' to clear note list.`);
                }
                blockArgs = oldNotes.concat(blockArgs);

            }

            const opcodes = blockArgs.map(_ => 'playNote');
            const xml = generateXMLForBlockChunk(this, runtime, opcodes, blockArgs);
            runtime.addBlocksToWorkspace(xml);
        });
    }

    getInstrument(util) {
        return this.musicCreationHelper.getInstrument(util);
    }


    _playNoteForPicker(noteNum, category) {
        if (category !== this.getInfo().name) return;
        const util = {
            runtime: this.runtime,
            target: this.runtime.getEditingTarget()
        };
        const inst = this.musicCreationHelper._getMusicState(util.target).currentInstrument;
        const vol = this.musicCreationHelper.findNumberForVolume(this.musicCreationHelper.getVolume(util));
        this.musicCreationHelper._playNote(util, noteNum, 0.25, inst, vol);
    }

    /**
     * Set the current tempo to a new value.
     * @param {object} args - the block arguments.
     * @param {BlockUtility} util - the block utility.
     * @property {number} TEMPO - the tempo, in beats per minute.
     * @param {BlockUtility} util
     */
    setVolume(args, util) {
        const volume = Cast.toNumber(args.VOLUME);
        this.musicCreationHelper._updateVolume(volume, util);
    }

    /**
     * @param {number[]} arr 
     * @param {number} query 
     */
    getClosestEntry(arr, query) {
        const initial = { delta: Number.MAX_SAFE_INTEGER, index: -1 };
        const closestIndex = arr
            .map((item, index) => ({ delta: Math.abs(item - query), index }))
            .reduce((previous, current) => current.delta < previous.delta ? current : previous, initial)
            .index;
        return arr[closestIndex];
    }

    /**
     * Scales a note value to a given scale
     * @param {{NOTE: number, SCALE: string}} args 
     * @param {BlockUtility} util 
     */
    roundNoteToScale(args, util) {
        const { NOTE, SCALE, TYPE } = args;
        const note = parseFloat(NOTE);
        const octave = Math.floor(note / 12);
        let root = parseInt(SCALE) + octave * 12;
        root = root < note ? root : root - 12;
        const offsets = TYPE === 'Major' ? this.majorScale : TYPE === 'Pentatonic' ? this.pentatonicScale : this.minorScale;
        const rounded = root + this.getClosestEntry(offsets, note - root);
        return rounded;
    }

    getVolume(util) {
        return this.musicCreationHelper.getVolume(util);
    }

    playNote(args, util) {
        const inst = this.getInstrumentForBlock(util);
        const vol = this.getVolumeForBlock(util);
        const toAdd = this.musicCreationHelper.playNote(args, util, inst, vol);
        if (toAdd.length == 3) {
            this.noteList.push(toAdd);
            toAdd.push(vol);
            this.vizHelper.requestViz(toAdd, util);
            this.wavenoteList.push(toAdd);
        }
    }

    playNoteList(args, util) {
        const notes = [Cast.toNumber(args.A), Cast.toNumber(args.B), Cast.toNumber(args.C)].filter(note => note > 0);
        if (notes.length === 0) return;
        const _args = notes.map(_ => JSON.parse(JSON.stringify(args)));
        const inst = this.getInstrumentForBlock(util);
        const vol = this.getVolumeForBlock(util);
        let beats = Cast.toNumber(args.SECS);
        beats = this.musicCreationHelper._clampBeats(beats);
        let instName = this.INSTRUMENT_INFO[inst].name;

        const visualizeByIndex = (index) => {
            let toAdd = [_args[index].NOTE, beats, instName];
            this.noteList.push(toAdd);
            toAdd.push(vol);
            this.vizHelper.requestViz(toAdd, util);
            this.wavenoteList.push(toAdd);
        }

        _args.forEach((arg, index) => arg.NOTE = notes[index]);

        for (let i = 1; i < notes.length; i++) {
            if (this.musicCreationHelper.stackTimerNeedsInit(util)) {
                this.musicCreationHelper.internalPlayNote(_args[i], util, inst, vol, false);
                visualizeByIndex(i);
            }

        }

        this.playNote(_args[0], util, inst, vol);
    }
}

module.exports = Scratch3MusicCreation;


