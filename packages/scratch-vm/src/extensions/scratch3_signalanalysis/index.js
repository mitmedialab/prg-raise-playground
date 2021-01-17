const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

const hrtime = require('browser-hrtime');
const mvae = require('@magenta/music/node/music_vae');
const core = require('@magenta/music/node/core');


class Scratch3SignalAnalysis {
    constructor (runtime) {
        this.runtime = runtime;
        this.louder = 'n/a';
        this.higher = 'n/a';
        this.instrument1 =  'n/a';
        this.instrument2 = "n/a";
    }

    getInfo () {
        return {
            id: 'signalanalysis',
            name: 'Signal Analysis',
            blocks: [
                {
                    opcode: 'playWav',
                    blockType: BlockType.COMMAND,
                    text: 'play [FILE]',
                    arguments: {
                        FILE: {
                            type: ArgumentType.STRING,
                            defaultValue: "file.wav"
                        }
                    }
                },
                {
                    opcode: 'compareVol',
                    blockType: BlockType.COMMAND,
                    text: 'compare volume for [FILE1] and [FILE2]',
                    arguments: {
                        FILE1: {
                            type: ArgumentType.STRING,
                            defaultValue: "file1.wav"
                        },
                        FILE2: {
                            type: ArgumentType.STRING,
                            defaultValue: "file2.wav"
                        }
                    }
                },
                {
                    opcode: 'compareFreq',
                    blockType: BlockType.COMMAND,
                    text: 'compare pitch for [FILE1] and [FILE2]',
                    arguments: {
                        FILE1: {
                            type: ArgumentType.STRING,
                            defaultValue: "file1.wav"
                        },
                        FILE2: {
                            type: ArgumentType.STRING,
                            defaultValue: "file2.wav"
                        }
                    }
                },
                {
                    opcode: 'compareInstr',
                    blockType: BlockType.COMMAND,
                    text: 'compare instrument for [FILE1] and [FILE2]',
                    arguments: {
                        FILE1: {
                            type: ArgumentType.STRING,
                            defaultValue: "file1.wav"
                        },
                        FILE2: {
                            type: ArgumentType.STRING,
                            defaultValue: "file2.wav"
                        }
                    }
                },
                {
                    opcode: 'getVolumeComp',
                    text: formatMessage({
                        id: 'signalanalysis.getVolumeComp',
                        default: 'volume',
                        description: 'get the current volume comparison'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getPitchComp',
                    text: formatMessage({
                        id: 'signalanalysis.getPitchComp',
                        default: 'volume',
                        description: 'get the current pitch comparison'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getInstrumentComp',
                    text: formatMessage({
                        id: 'signalanalysis.getInstrumentComp',
                        default: 'instrument',
                        description: 'get the current instrument comparison'
                    }),
                    blockType: BlockType.REPORTER
                }
            ],
            menus: {
            }
        };
    }

    playWav (args) {
        log.log("here");
        log.l
    }

    compareVol (args) {
        const text = Cast.toString(args.FILE1);
        log.log(text);
    }

    compareFreq (args) {
        const text = Cast.toString(args.FILE1);
        log.log(text);
    }

    compareInstr (args) {
        const text = Cast.toString(args.FILE1);
        log.log(text);
    }

    getVolumeComp (args) {
        const text = Cast.toString(args.FILE1);
        log.log(text);
        return this.louder;
    }

    getPitchComp (args) {
        const text = Cast.toString(args.FILE1);
        log.log(text);
        return this.higher;
    }

    getInstrumentComp (args) {
        const text = Cast.toString(args.FILE1);
        log.log(text);
        return this.instrument1;
    }
}

module.exports = Scratch3SignalAnalysis;