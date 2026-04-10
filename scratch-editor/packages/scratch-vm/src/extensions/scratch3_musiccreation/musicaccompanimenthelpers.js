const log = require('../../util/log');
const Cast = require('../../util/cast');
const hrtime = require('browser-hrtime');
const mvae = require('@magenta/music/node/music_vae');
const core = require('@magenta/music/node/core');
const rnn = require('@magenta/music/node/music_rnn');
const regeneratorRuntime = require("regenerator-runtime");

const symbols = require('./symbols');
const { time } = require('format-message');

var TWINKLE_TWINKLE, music_rnn, music_vae, magentaNotes, notes, rnn_steps, rnn_temperature;

/**
 * The instrument and drum sounds, loaded as static assets.
 * @type {object}
 */
let assetData = {};

try {
    assetData = require('./manifest');
} catch (e) {
    // Non-webpack environment, don't worry about assets.
}

class MusicAccompanimentHelpers {
    constructor(runtime, validNoteDurations, beatsPerSec) {
        this.runtime = runtime;
        this.validNoteDurations = validNoteDurations;
        this.beatsPerSec = beatsPerSec;
        TWINKLE_TWINKLE = {
            notes: [
                { pitch: 60, startTime: 0.0, endTime: 0.5 },
                { pitch: 60, startTime: 0.5, endTime: 1.0 },
                { pitch: 67, startTime: 1.0, endTime: 1.5 },
                { pitch: 67, startTime: 1.5, endTime: 2.0 },
                { pitch: 69, startTime: 2.0, endTime: 2.5 },
                { pitch: 69, startTime: 2.5, endTime: 3.0 },
                { pitch: 67, startTime: 3.0, endTime: 4.0 },
                { pitch: 65, startTime: 4.0, endTime: 4.5 },
                { pitch: 65, startTime: 4.5, endTime: 5.0 },
                { pitch: 64, startTime: 5.0, endTime: 5.5 },
                { pitch: 64, startTime: 5.5, endTime: 6.0 },
                { pitch: 62, startTime: 6.0, endTime: 6.5 },
                { pitch: 62, startTime: 6.5, endTime: 7.0 },
                { pitch: 60, startTime: 7.0, endTime: 8.0 },
            ],
            totalTime: 8
        };

        this.noteList = [];

        music_rnn = new rnn.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
        music_rnn.initialize();

        music_vae = new mvae.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_small_q2');
        music_vae.initialize();

    }

    configure(noteList) {
        let elapsedTime = 0;
        const notes = noteList.map(([pitch, duration]) => {
            const startTime = elapsedTime;
            elapsedTime = startTime + parseFloat(duration);
            return { pitch, startTime, endTime: elapsedTime };
        });

        return { notes, totalTime: elapsedTime };;
    }

    constrainDuration(duration) {
        const initial = { delta: Number.MAX_VALUE, index: -1 };
        const { index } = this.validNoteDurations
            .map((valid, index) => ({ delta: Math.abs(valid - duration), index }))
            .reduce((minimum, query) => (query.delta < minimum.delta) ? query : minimum, initial);
        return parseFloat(this.validNoteDurations[index]);
    }

    processed(notes) {
        return notes.map(note => {
            const { quantizedStartStep, quantizedEndStep, pitch } = note;
            const duration = (quantizedEndStep - quantizedStartStep) / this.beatsPerSec;
            return [pitch, this.constrainDuration(duration), "Piano", 60];
        });
    }

    async testMagentaRNN(noteList, args, utils) {
        notes = this.configure(noteList);
        rnn_steps = Cast.toNumber(args.STEPS);
        rnn_temperature = Cast.toNumber(args.TEMP);

        // The model expects a quantized sequence, and ours was unquantized:
        const qns = core.sequences.quantizeNoteSequence(notes, this.beatsPerSec);
        const generated = await music_rnn.continueSequence(qns, rnn_steps, rnn_temperature);
        magentaNotes = this.processed(generated.notes);
        return magentaNotes;
    }

    async testMagentaMVAE(utils) {
        const vae_temperature = 3;
        const generated = await music_vae.sample(1, vae_temperature)
        magentaNotes = this.processed(generated[0].notes);
        return magentaNotes;
    }
}

module.exports = MusicAccompanimentHelpers;