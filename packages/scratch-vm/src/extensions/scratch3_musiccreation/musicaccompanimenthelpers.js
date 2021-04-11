const log = require('../../util/log');
const Cast = require('../../util/cast');
const hrtime = require('browser-hrtime');
const mvae = require('@magenta/music/node/music_vae');
const core = require('@magenta/music/node/core');
const rnn = require('@magenta/music/node/music_rnn');

const symbols = require('./symbols');
const { time } = require('format-message');


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
    constructor (runtime) {
        this.runtime = runtime;
        TWINKLE_TWINKLE = {
            notes: [
              {pitch: 60, startTime: 0.0, endTime: 0.5},
              {pitch: 60, startTime: 0.5, endTime: 1.0},
              {pitch: 67, startTime: 1.0, endTime: 1.5},
              {pitch: 67, startTime: 1.5, endTime: 2.0},
              {pitch: 69, startTime: 2.0, endTime: 2.5},
              {pitch: 69, startTime: 2.5, endTime: 3.0},
              {pitch: 67, startTime: 3.0, endTime: 4.0},
              {pitch: 65, startTime: 4.0, endTime: 4.5},
              {pitch: 65, startTime: 4.5, endTime: 5.0},
              {pitch: 64, startTime: 5.0, endTime: 5.5},
              {pitch: 64, startTime: 5.5, endTime: 6.0},
              {pitch: 62, startTime: 6.0, endTime: 6.5},
              {pitch: 62, startTime: 6.5, endTime: 7.0},
              {pitch: 60, startTime: 7.0, endTime: 8.0},  
            ],
            totalTime: 8
          };

          this.noteList = [];

    }

    configure(noteList) {
        newNotes = {
            notes: [

            ],
            totalTime: 0
        };
        t = 0;
        for (var i in noteList) {
            note = noteList[i];
            newNotes.notes.push({pitch: note[0], startTime: t, endTime: t + note[1]});
            t = t + note[1];
            newNotes.totalTime += note[1];
        }
        return newNotes;
    }

    testMagentaPlayer (noteList, util) {
        log.log("MAGENTA");
        notes = this.configure(noteList);
		const player = new core.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
		player.start(notes);
		player.stop();
    }

    testMagentaRNN (noteList, args, utils) {
        const player = new core.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
        if (player.isPlaying()) {
            player.stop();
            return;
        }
        log.log("player done");
        notes = this.configure(noteList);
        music_rnn = new rnn.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
        music_rnn.initialize();
        rnn_steps = Cast.toNumber(args.STEPS);
        rnn_temperature = Cast.toNumber(args.TEMP);
              
        const qns = core.sequences.quantizeNoteSequence(notes, 4);
        music_rnn
        .continueSequence(qns, rnn_steps, rnn_temperature)
        .then((sample) => player.start(sample));
        log.log(sample);
        log.log(TWINKLE_TWINKLE);
    }

    testMagentaMVAE (utils) {
        const player = new core.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
        if (player.isPlaying()) {
            player.stop();
            return;
        }
        music_vae = new mvae.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_small_q2');
        music_vae.initialize();
        vae_temperature = 1.5;

        music_vae
        .sample(1, vae_temperature)
        .then((sample) => player.start(sample[0]));
        log.log(TWINKLE_TWINKLE);
    }

}

module.exports = MusicAccompanimentHelpers;