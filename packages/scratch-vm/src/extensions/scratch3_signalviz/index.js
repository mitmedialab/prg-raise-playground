const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class Scratch3SignalViz {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'signalViz',
            name: 'Signal Visualization',
            blocks: [
                {
                    opcode: 'timeViz',
                    blockType: BlockType.COMMAND,
                    text: 'plot time domain for [SIGNAL]',
                    arguments: {
                        SIGNAL: {
                            type: ArgumentType.STRING,
                            defaultValue: "test.wav"
                        }
                    }
                },
                {
                    opcode: 'freqViz',
                    blockType: BlockType.COMMAND,
                    text: 'plot frequency domain for [SIGNAL]',
                    arguments: {
                        SIGNAL: {
                            type: ArgumentType.STRING,
                            defaultValue: "test.wav"
                        }
                    }
                },
                {
                    opcode: 'specViz',
                    blockType: BlockType.COMMAND,
                    text: 'plot spectrogram for [SIGNAL]',
                    arguments: {
                        SIGNAL: {
                            type: ArgumentType.STRING,
                            defaultValue: "test.wav"
                        }
                    }
                },
                {
                    opcode: 'musicViz',
                    blockType: BlockType.COMMAND,
                    text: 'create sheet music for [SIGNAL]',
                    arguments: {
                        SIGNAL: {
                            type: ArgumentType.STRING,
                            defaultValue: "test.wav"
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    timeViz (args) {
        const text = Cast.toString(args.SIGNAL);
        log.log(text);
    }

    freqViz (args) {
        const text = Cast.toString(args.SIGNAL);
        log.log(text);
    }

    specViz (args) {
        const text = Cast.toString(args.SIGNAL);
        log.log(text);
    }

    musicViz (args) {
        const text = Cast.toString(args.SIGNAL);
        log.log(text);
    }
}

module.exports = Scratch3SignalViz;