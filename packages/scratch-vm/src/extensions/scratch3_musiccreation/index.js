const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const mvae = require('@magenta/music/node/music_vae');
const core = require('@magenta/music/node/core');


class Scratch3MusicCreation {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'musiccreation',
            name: 'Music Creation',
            blocks: [
                {
                    opcode: 'setInstrument',
                    blockType: BlockType.COMMAND,
                    text: 'set instrument to [INSTRUMENT]',
                    arguments: {
                        INSTRUMENT: {
                            type: ArgumentType.STRING,
                            defaultValue: "synth",
                            menu: "instruments"
                        }
                    }
                },
                {
                    opcode: 'setPitch',
                    blockType: BlockType.COMMAND,
                    text: 'set pitch to [PITCH]',
                    arguments: {
                        PITCH: {
                            type: ArgumentType.STRING,
                            defaultValue: "C3",
                            menu: "pitches"
                        }
                    }
                },
                {
                    opcode: 'setVolume',
                    blockType: BlockType.COMMAND,
                    text: 'set volume to [VOLUME] dB',
                    arguments: {
                        VOLUME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 60
                        }
                    }
                },
                {
                    opcode: 'addNote',
                    blockType: BlockType.COMMAND,
                    text: 'add note',
                    arguments: {
                    }
                },
                {
                    opcode: 'addNoteFreqDur',
                    blockType: BlockType.COMMAND,
                    text: 'add note with frequency [PITCH] for [DURATION] second(s)',
                    arguments: {
                        PITCH: {
                            type: ArgumentType.STRING,
                            defaultValue: "C3",
                            menu: "pitches"
                        },
                        DURATION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'setDuration',
                    blockType: BlockType.COMMAND,
                    text: 'set duration to [DURATION] second(s)',
                    arguments: {
                        DURATION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'saveFile',
                    blockType: BlockType.COMMAND,
                    text: 'save file to [FILENAME].wav',
                    arguments: {
                        FILENAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "myMusic"
                        }
                    }
                }
            ],
            menus: {
                instruments: {
                    acceptReporters: true,
                    items: [
                        {text: "violin", value: "violin"}, 
                        {text: "flute", value: "flute"}, 
                        {text: "saxophone", value: "saxophone"},
                        {text: "clarinet", value: "clarinet"},
                        {text: "trumpet", value: "trumpet"}]
                },
                pitches: {
                    acceptReporters: true,
                    items: [
                        {text: "D3", value: "D3"}, 
                        {text: "E3", value: "E3"}, 
                        {text: "F3", value: "F3"},
                        {text: "G3", value: "G3"},
                        {text: "A4", value: "A4"},
                        {text: "B4", value: "B4"},
                        {text: "C4", value: "C4"},
                        {text: "D4", value: "D4"}]
                }
            }
        };
    }

    setInstrument (args) {
        const text = Cast.toString(args.INSTRUMENT);
        log.log(text);
    }

    setPitch (args) {
        const text = Cast.toString(args.PITCH);
        log.log(text);
    }

    setVolume (args) {
        const text = Cast.toString(args.VOLUME);
        log.log(text);
    }

    setDuration (args) {
        const text = Cast.toString(args.DURATION);
        log.log(text);
    }
    addNote (args) {
        const text = "text";
        log.log(text);
    }
    addNoteFreqDur (args) {
        const text = "text";
        log.log(text);
    }

    saveFile (args) {
        const text = Cast.toString(args.FILENAME);
        log.log(text);
    }


}

module.exports = Scratch3MusicCreation;