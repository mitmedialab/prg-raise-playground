const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class Scratch3MusicAccompaniment {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'musicaccompaniment',
            name: 'Music Accompaniment',
            blocks: [
                {
                    opcode: 'soundRec',
                    blockType: BlockType.COMMAND,
                    text: 'extract [SOUND] from [FILE]',
                    arguments: {
                        SOUND: {
                            type: ArgumentType.STRING,
                            defaultValue: "music",
                            menu: "sounds"
                        },
                        FILE: {
                            type: ArgumentType.STRING,
                            defaultValue: "test.wav"
                        }
                    }
                },
                {
                    opcode: 'genreRec',
                    blockType: BlockType.COMMAND,
                    text: 'classify genre of [FILE]',
                    arguments: {
                        FILE: {
                            type: ArgumentType.STRING,
                            defaultValue: "test.wav"
                        }
                    }
                },
                {
                    opcode: 'musicAccomp',
                    blockType: BlockType.COMMAND,
                    text: 'generate [GENRE] accompaniment for [FILE]',
                    arguments: {
                        GENRE: {
                            type: ArgumentType.STRING,
                            defaultValue: "jazz",
                            menu: 'genres'
                        },
                        FILE: {
                            type: ArgumentType.STRING,
                            defaultValue: "test.wav"
                        }
                    }
                }
            ],
            menus: {
                sounds: {
                    acceptReporters: true,
                    items: [
                        {text: "music", value: "music"}, 
                        {text: "speech", value: "speech"}, 
                        {text: "noise", value: "noise"}]
                },
                genres: {
                    acceptReporters: true,
                    items: [
                        {text: "jazz", value: "jazz"}, 
                        {text: "pop", value: "pop"}, 
                        {text: "rock", value: "rock"}]
                }
            }
        };
    }

    soundRec (args) {
        const text = Cast.toString(args.SOUND);
        log.log(text);
    }

    genreRec (args) {
        const text = Cast.toString(args.FILE);
        log.log(text);
    }

    musicAccomp (args) {
        const text = Cast.toString(args.VOLUME);
        log.log(text);
    }

}

module.exports = Scratch3MusicAccompaniment;