const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class Scratch3SignalAnalysis {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'signalanalysis',
            name: 'Signal Analysis',
            blocks: [
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
                }
            ],
            menus: {
            }
        };
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
}

module.exports = Scratch3SignalAnalysis;