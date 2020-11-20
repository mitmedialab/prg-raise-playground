const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class Scratch3SignalControl {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'signalcontrol',
            name: 'Signal Control',
            blocks: [
                {
                    opcode: 'isVolume',
                    blockType: BlockType.BOOLEAN,
                    text: 'audio has volume between [CONDITIONVOL1] dB and [CONDITIONVOL2] dB',
                    arguments: {
                        CONDITIONVOL1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 60
                        },
                        CONDITIONVOL2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 70
                        }
                    }
                },
                {
                    opcode: 'isPitch',
                    blockType: BlockType.BOOLEAN,
                    text: 'audio has pitch [CONDITIONPITCH]',
                    arguments: {
                        CONDITIONPITCH: {
                            type: ArgumentType.STRING,
                            defaultValue: "C3",
                            menu: "pitches"
                        }
                    }
                },
                {
                    opcode: 'isInstrument',
                    blockType: BlockType.BOOLEAN,
                    text: 'audio has instrument [INSTRUMENT]',
                    arguments: {
                        INSTRUMENT: {
                            type: ArgumentType.STRING,
                            defaultValue: "synth",
                            menu: "instruments"
                        }
                    }
                },
                {
                    opcode: 'isSoundType',
                    blockType: BlockType.BOOLEAN,
                    text: 'audio contains [SOUND]',
                    arguments: {
                        SOUND: {
                            type: ArgumentType.STRING,
                            defaultValue: "music",
                            menu: "sounds"
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
                },
                sounds: {
                    acceptReporters: true,
                    items: [
                        {text: "music", value: "music"}, 
                        {text: "speech", value: "speech"}, 
                        {text: "noise", value: "noise"}]
                }
            }
        };
    }

    isPitch (args) {
        const pitch = "C3";
        const conditionPitch = Cast.toString(args.CONDITIONPITCH);
        if (pitch === conditionPitch) {
            return true;
        }
        return false;
    }

    isVolume (args) {
        const volume = 60;
        const conditionVo1 = args.CONDITIONVOL1;
        const conditionVol2 = args.CONDITIONVOL2;
        if (volume > conditionVol2 && volume < conditionVol2) {
            return true;
        }
        return false;
    }

    isInstrument (args) {
        const instrument = Cast.toString(args.INSTRUMENT);
        if (instrument === instrument) {
            return true;
        }
        return false;
    }

    isSoundType (args) {
        const instrument = Cast.toString(args.SOUND);
        if (instrument === instrument) {
            return true;
        }
        return false;
    }





}

module.exports = Scratch3SignalControl;