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
const AnalysisHelpers = require('./analysishelpers');
const MusicPlayers = require('./musicplayer')
const textRender = require('./textrender');
const regeneratorRuntime = require("regenerator-runtime"); //do not delete
const { internalIDKey, getTopBlockID, addTopBlockModifier, getTopBlockModifier } = require('../../extension-support/block-relationships');

const instrumentModifierKey = 'instrument';
const volumeModifierKey = 'volume';

class Scratch3MusicCreation {
    constructor(runtime) {
        this.runtime = runtime;
        this.musicPlayer = new MusicPlayers(runtime);
        this.vizHelper = new VizHelpers(runtime);
        this.musicCreationHelper = new MusicCreationHelpers(runtime);
        this.musicAccompanimentHelper = new MusicAccompanimentHelpers(runtime);
        this.analysisHelper = new AnalysisHelpers(runtime);

        this.noteList = [];
        this.wavenoteList = [];
        this.magentaNoteList = [];

        this.volumes = [{ text: "pianissimo", value: '15' },
        { text: "piano", value: '30' },
        { text: "mezzo-piano", value: '45' },
        { text: "mezzo-forte", value: '60' },
        { text: "forte", value: '85' },
        { text: "fortissimo", value: '100' }];

        this.beats = [{ text: "1/4", value: '0.0625' },
        { text: "1/2", value: '0.125' },
        { text: "1", value: '0.25' },
        { text: "2", value: '0.5' },
        { text: "3", value: '0.75' },
        { text: "4", value: '1' }];

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
                    opcode: 'getInstrument',
                    text: formatMessage({
                        id: 'musiccreation.getInstrument',
                        default: 'instrument',
                        description: 'get the current instrument'
                    }),
                    blockType: BlockType.REPORTER
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
                            defaultValue: 0.25,
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
                    opcode: 'testMagentaMVAE',
                    text: formatMessage({
                        id: 'musiccreation.testMagentaMVAE',
                        default: 'generate new music',
                        description: 'test Magenta MVAE'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'toggleVisMode',
                    blockType: BlockType.COMMAND,
                    text: 'set visualization mode to [STATUS] with [FORMAT]',
                    arguments: {
                        STATUS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '0',
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
                    opcode: 'playMystery',
                    blockType: BlockType.COMMAND,
                    text: 'play [FILE]',
                    arguments: {
                        FILE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            menu: "FILES"
                        }
                    },
                },
                {
                    opcode: 'compareFiles',
                    blockType: BlockType.COMMAND,
                    text: 'compare [FILE1] and [FILE2]',
                    arguments: {
                        FILE1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                            menu: "FILES"
                        },
                        FILE2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2,
                            menu: "FILES"
                        },
                    },
                },
                {
                    opcode: 'getLouder',
                    text: formatMessage({
                        id: 'musiccreation.getLouder',
                        default: 'louder',
                        description: 'get the current louder note'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getHigher',
                    text: formatMessage({
                        id: 'musiccreation.getHigher',
                        default: 'higher',
                        description: 'get the current higher note'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getInst1',
                    text: formatMessage({
                        id: 'musiccreation.getInst1',
                        default: 'instrument 1',
                        description: 'get the current instrument 1'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getInst2',
                    text: formatMessage({
                        id: 'musiccreation.getInst2',
                        default: 'instrument 2',
                        description: 'get the current instrument 2'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'setText',
                    text: formatMessage({
                        id: 'musiccreation.setText',
                        default: 'show text [TEXT]',
                        description: ''
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "DEFAULT"
                        }
                    }
                }

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
                }

            }
        };
    }

    setText(args, util) {
        this.textRenderer.say(args.TEXT, args, util);
    }

    resetMusic(args, util) {
        this.noteList = [];
        this.wavenoteList = [];
        this.magentaNoteList = [];
        this.vizHelper.clearNoteBuffers();
        this.vizHelper.requestViz(null,util);
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
        addTopBlockModifier(util, args[internalIDKey], instrumentModifierKey, Cast.toNumber(args.INSTRUMENT));
    }

    setVolumeForBelow(args, util) {
        let vol_n = Cast.toNumber(args.VOLUME);
        addTopBlockModifier(util, args[internalIDKey], volumeModifierKey, vol_n);
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
    adjustFreqsToRange(hi,low,notes) {
        notes.map( 
            (note) => {
                let freq = note[0];
                if (freq < low) {
                    const diff = low - freq;
                    note[0] += (Math.ceil(diff/12.0) * 12);
                } else if (freq > hi) {
                    const diff = freq - hi;
                    note[0] -= (Math.ceil(diff/12.0) * 12);
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
     * @private 
     */
    async _getAndPlayMagentaNotes(RNN, args, utils, inst, vol) {
        let magenta_notes = null;
        let valid = true;
        if (RNN) {
            if (this.noteList.length > 0) {
                const low = 48;
                const hi = 83;
                //copy the noteList so that it doesn't change
                const adjusted_notes = this.adjustFreqsToRange(hi,low,JSON.parse(JSON.stringify(this.noteList)));
                magenta_notes = await this.musicAccompanimentHelper.testMagentaRNN(adjusted_notes, args, utils);
                
            } else valid = false;
        } else {
            magenta_notes = await this.musicAccompanimentHelper.testMagentaMVAE(utils);
        }
        if (valid) {
            const prepared_notes = this._prepare(magenta_notes);
            this.magentaNoteList = prepared_notes['notes'];
            this.musicCreationHelper.playNotes(prepared_notes, utils, inst,vol,this.vizHelper); 
        } else utils.stackFrame.duration = 0;
    }
    

    getInstrumentForBlock(id, util) {
        const modifierInst = getTopBlockModifier(util, id, instrumentModifierKey);
        return (modifierInst !== undefined && modifierInst !== null) ? modifierInst : this.musicCreationHelper._getMusicState(util.target).currentInstrument;
    }

    getVolumeForBlock(id, util) {
        const modifierVol = getTopBlockModifier(util, id, volumeModifierKey);
        return modifierVol ? modifierVol : this.musicCreationHelper.findNumberForVolume(this.getVolume(util));
    }

    /**
     * Used to get the generated sequence of notes from Magenta and 
     * play it. 
     * @param {boolean} RNN - true if 'complete music', false if 'generate new music'
     * @param {array} args - arguments to be given to the music helper
     * @param {BlockUtility} util
     */
    getAndPlayMagentaNotes(RNN, args, util) {
        const inst = this.getInstrumentForBlock(args[internalIDKey], util);
        const vol = this.getVolumeForBlock(args[internalIDKey], util);
        if (util.stackTimerNeedsInit()) {
            // get timer running for a large amount of time (will be handled)
            util.startStackTimer(Number.MAX_SAFE_INTEGER);
            util.yield();
            this._getAndPlayMagentaNotes(RNN, args, util, inst, vol);
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
     */
    setVolume(args, util) {
        const volume = Cast.toNumber(args.VOLUME);
        this.musicCreationHelper._updateVolume(volume, util);
    }

    getVolume(util) {
        return this.musicCreationHelper.getVolume(util);
    }

    playNote(args, util) {
        const inst = this.getInstrumentForBlock(args[internalIDKey], util);
        const vol = this.getVolumeForBlock(args[internalIDKey], util);
        toAdd = this.musicCreationHelper.playNote(args, util, inst, vol);
        if (toAdd.length == 3) {
            this.noteList.push(toAdd);
            toAdd.push(vol);
            this.vizHelper.requestViz(toAdd, util);
            this.wavenoteList.push(toAdd);
        }
    }

    playMystery(args, util) {
        this.analysisHelper.playFile(args, util);
    }

    compareFiles(args, util) {
        this.analysisHelper.compareFiles(args, util);
    }

    getLouder(util) {
        return this.analysisHelper.getLouder(util);
    }

    getHigher(util) {
        return this.analysisHelper.getHigher(util);
    }

    getInst1(util) {
        return this.analysisHelper.getInst1(util);
    }

    getInst2(util) {
        return this.analysisHelper.getInst2(util);
    }


}

module.exports = Scratch3MusicCreation;


